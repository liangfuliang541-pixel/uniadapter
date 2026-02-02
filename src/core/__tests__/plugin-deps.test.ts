import { describe, it, expect, vi } from 'vitest'
import { registerPlugin, listPlugins, onPluginEvent, unregisterPlugin } from '../plugin'

describe('plugin dependency handling', () => {
  it('orders plugins so dependencies come first', () => {
    // ensure clean state by using unique names
    registerPlugin({ name: 'dep-B', priority: 1 } as any)
    registerPlugin({ name: 'dep-A', priority: 2, depends: ['dep-B'] } as any)

    const order = listPlugins().map((p) => p.name)
    expect(order.indexOf('dep-B')).toBeLessThan(order.indexOf('dep-A'))

    unregisterPlugin('dep-A')
    unregisterPlugin('dep-B')
  })

  it('emits error when dependency missing', () => {
    const spy = vi.fn()
    const unsub = onPluginEvent('error', spy)

    registerPlugin({ name: 'missing-test', depends: ['no-such'] } as any)

    expect(spy).toHaveBeenCalled()

    unsub()
    unregisterPlugin('missing-test')
  })
})
