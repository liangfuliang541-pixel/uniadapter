import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  registerPlugin,
  unregisterPlugin,
  activatePlugin,
  deactivatePlugin,
  onPluginEvent,
  listPlugins,
  getPlugin
} from '../plugin'

describe('plugin system events', () => {
  beforeEach(() => {
    // ensure unique names in tests to avoid cross-test interference
  })

  it('emits registered and changed on register', () => {
    const spyRegistered = vi.fn()
    const unsub = onPluginEvent('registered', spyRegistered)

    const plugin = { name: 'test-plugin-1' }
    registerPlugin(plugin as any)

    expect(spyRegistered).toHaveBeenCalled()
    const list = listPlugins().map((p) => p.name)
    expect(list).toContain('test-plugin-1')

    unsub()
    unregisterPlugin('test-plugin-1')
  })

  it('activates and deactivates and emits events', async () => {
    const spyActivated = vi.fn()
    const spyDeactivated = vi.fn()
    onPluginEvent('activated', spyActivated)
    onPluginEvent('deactivated', spyDeactivated)

    const activateSpy = vi.fn()
    const deactivateSpy = vi.fn()

    const plugin = {
      name: 'test-plugin-2',
      activate: () => activateSpy(),
      deactivate: () => deactivateSpy()
    }

    registerPlugin(plugin as any)

    await activatePlugin('test-plugin-2')
    expect(activateSpy).toHaveBeenCalled()
    expect(spyActivated).toHaveBeenCalled()

    await deactivatePlugin('test-plugin-2')
    expect(deactivateSpy).toHaveBeenCalled()
    expect(spyDeactivated).toHaveBeenCalled()

    unregisterPlugin('test-plugin-2')
  })

  it('emits unregistered on unregister', () => {
    const spy = vi.fn()
    onPluginEvent('unregistered', spy)

    const plugin = { name: 'test-plugin-3' }
    registerPlugin(plugin as any)
    unregisterPlugin('test-plugin-3')

    expect(spy).toHaveBeenCalled()
  })
})
