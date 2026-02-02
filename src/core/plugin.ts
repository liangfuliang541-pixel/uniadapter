export type UniAdapterPlugin = {
  name: string
  version?: string
  initialize?: (options?: any) => Promise<void> | void
}

const registered: Record<string, UniAdapterPlugin> = {}

export function registerPlugin(plugin: UniAdapterPlugin) {
  if (!plugin || !plugin.name) throw new Error('Invalid plugin')
  registered[plugin.name] = plugin
  if (plugin.initialize) plugin.initialize()
}

export function getPlugin(name: string): UniAdapterPlugin | undefined {
  return registered[name]
}

export function listPlugins(): UniAdapterPlugin[] {
  return Object.values(registered)
}
