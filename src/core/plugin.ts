export type UniAdapterPlugin = {
  name: string
  version?: string
  priority?: number // higher runs earlier
  depends?: string[]
  initialize?: (options?: any) => Promise<void> | void
  activate?: (options?: any) => Promise<void> | void
  deactivate?: (options?: any) => Promise<void> | void
}

type PluginEvent =
  | 'registered'
  | 'activated'
  | 'deactivated'
  | 'unregistered'
  | 'changed'
  | 'error'
  | 'telemetry'

type PluginEventPayload = {
  event: PluginEvent
  name: string
  plugin?: UniAdapterPlugin
  timestamp: number
  reason?: string
  cycle?: string[]
  attempts?: number
  rolledBack?: string[]
  error?: { message: string; stack?: string }
}

type PluginEventHandler = (payload: PluginEventPayload) => void

class SimpleEmitter {
  private listeners: Map<PluginEvent, Set<PluginEventHandler>> = new Map()

  on(event: PluginEvent, cb: PluginEventHandler) {
    const set = this.listeners.get(event) || new Set()
    set.add(cb)
    this.listeners.set(event, set)
    return () => this.off(event, cb)
  }

  off(event: PluginEvent, cb: PluginEventHandler) {
    const set = this.listeners.get(event)
    if (!set) return
    set.delete(cb)
  }

  emit(event: PluginEvent, payload: { name: string; plugin?: UniAdapterPlugin }) {
    const enriched: PluginEventPayload = Object.assign({ event, timestamp: Date.now() } as any, payload as any)
    const set = this.listeners.get(event)
    if (set) {
      for (const cb of Array.from(set)) cb(enriched)
    }
    // always emit a generic "changed" event after specific lifecycle events
    if (event !== 'changed') {
      const changed = this.listeners.get('changed')
      if (changed) for (const cb of Array.from(changed)) cb(enriched)
    }
  }
}

const emitter = new SimpleEmitter()
const registered: Record<string, UniAdapterPlugin> = {}

export function onPluginEvent(event: PluginEvent, cb: PluginEventHandler) {
  return emitter.on(event, cb)
}

export function offPluginEvent(event: PluginEvent, cb: PluginEventHandler) {
  return emitter.off(event, cb)
}

export function registerPlugin(plugin: UniAdapterPlugin) {
  if (!plugin || !plugin.name) throw new Error('Invalid plugin')
  registered[plugin.name] = plugin
  // detect missing dependencies immediately and emit error
  if (Array.isArray(plugin.depends)) {
    for (const dep of plugin.depends) {
      if (!registered[dep]) {
        emitter.emit('error', { name: plugin.name, plugin, event: 'error', timestamp: Date.now(), reason: 'missing_dependency', cycle: undefined, error: { message: `missing dependency ${dep}` } })
      }
    }
  }
  // call initialize but do not block emission
  try {
    const res = plugin.initialize && plugin.initialize()
    if (res && typeof (res as Promise<void>).then === 'function') {
      ;(res as Promise<void>)
        .then(() => emitter.emit('registered', { name: plugin.name, plugin, event: 'registered', timestamp: Date.now() }))
        .catch((e) => emitter.emit('registered', { name: plugin.name, plugin, event: 'registered', timestamp: Date.now(), error: { message: String(e?.message || e), stack: e?.stack } }))
    } else {
      emitter.emit('registered', { name: plugin.name, plugin, event: 'registered', timestamp: Date.now() })
    }
  } catch (e) {
    emitter.emit('registered', { name: plugin.name, plugin, event: 'registered', timestamp: Date.now(), error: { message: String(e?.message || e), stack: e?.stack } })
  }
}

export function unregisterPlugin(name: string) {
  const plugin = registered[name]
  if (!plugin) return
  delete registered[name]
  emitter.emit('unregistered', { name, plugin })
}

export type ActivateConfig = {
  maxAttempts?: number
  rollbackOnFailure?: boolean
}

export function activatePlugin(name: string, options?: any, config?: ActivateConfig) {
  // activate plugin and its dependencies with retry + rollback
  const plugin = registered[name]
  if (!plugin) throw new Error('Plugin not found')

  const activated: string[] = []

  async function runWithRetries(fn: () => Promise<void> | void, attempts = 3) {
    let lastErr: any
    for (let i = 1; i <= attempts; i++) {
      try {
        const res = fn()
        if (res && typeof (res as Promise<void>).then === 'function') await res as Promise<void>
        return i
      } catch (e) {
        lastErr = e
        if (i < attempts) await new Promise((r) => setTimeout(r, 50 * i))
      }
    }
    throw lastErr
  }

  async function activateRecursive(pname: string) {
    const p = registered[pname]
    if (!p) throw new Error('Plugin not found: ' + pname)
    const deps = Array.isArray(p.depends) ? p.depends : []
    for (const d of deps) {
      if (!activated.includes(d)) {
        await activateRecursive(d)
      }
    }
    if (!activated.includes(pname)) {
      const attempts = await runWithRetries(() => p.activate && p.activate(options), (config && typeof config.maxAttempts === 'number') ? config.maxAttempts : 3)
      activated.push(pname)
        emitter.emit('activated', { name: pname, plugin: p, event: 'activated', timestamp: Date.now(), attempts })
    }
  }

  return (async () => {
    try {
      await activateRecursive(name)
      return
    } catch (err) {
      // rollback previously activated plugins in reverse order
        const rolledBack: string[] = []
        if ((config && config.rollbackOnFailure === false) === false) {
          for (let i = activated.length - 1; i >= 0; i--) {
            const pn = activated[i]
            try {
              const pp = registered[pn]
              if (pp && pp.deactivate) await pp.deactivate(options)
              rolledBack.push(pn)
            } catch (e) {
              // ignore individual deactivate errors
            }
          }
        }

        const payload = {
          name,
          plugin,
          event: 'error' as PluginEvent,
          timestamp: Date.now(),
          reason: 'activate_failed',
          rolledBack,
          error: { message: String(err?.message || err), stack: err?.stack }
        }
        emitter.emit('error', payload)
        // emit telemetry for external collectors
        emitter.emit('telemetry', { event: 'telemetry', name, plugin, timestamp: Date.now(), reason: 'activate_failed', error: payload.error, rolledBack })
        throw err
    }
  })()
}

export function deactivatePlugin(name: string, options?: any) {
  const plugin = registered[name]
  if (!plugin) throw new Error('Plugin not found')
  const res = plugin.deactivate && plugin.deactivate(options)
  if (res && typeof (res as Promise<void>).then === 'function') {
    return (res as Promise<void>).then(() => emitter.emit('deactivated', { name, plugin, event: 'deactivated', timestamp: Date.now() }))
  }
  emitter.emit('deactivated', { name, plugin, event: 'deactivated', timestamp: Date.now() })
}

export function getPlugin(name: string): UniAdapterPlugin | undefined {
  return registered[name]
}

export function listPlugins(): UniAdapterPlugin[] {
  // attempt to topologically sort by dependencies, then priority
  const items = Object.values(registered)
  const nameMap = new Map(items.map((p) => [p.name, p]))

  // build graph
  const adj = new Map<string, Set<string>>()
  const indeg = new Map<string, number>()
  for (const p of items) {
    adj.set(p.name, new Set())
    indeg.set(p.name, 0)
  }
  for (const p of items) {
    const deps = Array.isArray(p.depends) ? p.depends : []
    for (const d of deps) {
      if (!nameMap.has(d)) {
        // missing dependency — emit error but continue
        emitter.emit('error', { name: p.name, plugin: p })
        continue
      }
      adj.get(d)!.add(p.name)
      indeg.set(p.name, (indeg.get(p.name) || 0) + 1)
    }
  }

  // Kahn's algorithm with priority tie-break
  const queue: string[] = []
  for (const [name, deg] of indeg) {
    if (deg === 0) queue.push(name)
  }
  const result: UniAdapterPlugin[] = []

  while (queue.length) {
    // pick highest priority among queue
    queue.sort((a, b) => {
      const pa = typeof nameMap.get(a)!.priority === 'number' ? nameMap.get(a)!.priority! : 0
      const pb = typeof nameMap.get(b)!.priority === 'number' ? nameMap.get(b)!.priority! : 0
      if (pa !== pb) return pb - pa
      return a.localeCompare(b)
    })
    const n = queue.shift()!
    result.push(nameMap.get(n)!)
    for (const nei of Array.from(adj.get(n)!)) {
      indeg.set(nei, (indeg.get(nei) || 1) - 1)
      if (indeg.get(nei) === 0) queue.push(nei)
    }
  }

  if (result.length !== items.length) {
    // cycle detected — emit error and fallback to priority ordering
    emitter.emit('error', { name: 'listPlugins', plugin: undefined })
    return items.sort((a, b) => {
      const pa = typeof a.priority === 'number' ? a.priority : 0
      const pb = typeof b.priority === 'number' ? b.priority : 0
      if (pa !== pb) return pb - pa
      return a.name.localeCompare(b.name)
    })
  }

  return result
}
