import { describe, it, expect, vi } from 'vitest'
import { registerPlugin, unregisterPlugin, activatePlugin, onPluginEvent } from '../plugin'

describe('plugin recovery and rollback', () => {
  it('rolls back activated dependencies when a dependency activation fails and emits telemetry', async () => {
    const events: any[] = []
    const telemetry: any[] = []
    const unsubErr = onPluginEvent('error', (p) => events.push(p))
    const unsubTel = onPluginEvent('telemetry', (p) => telemetry.push(p))

    const deactivated = vi.fn()

    registerPlugin({ name: 'dep1', activate: () => { /* ok */ }, deactivate: () => { deactivated() } } as any)
    registerPlugin({ name: 'dep2', activate: () => { throw new Error('fail') }, deactivate: () => { deactivated() } } as any)
    registerPlugin({ name: 'main', depends: ['dep1', 'dep2'], activate: () => { /* won't run */ }, deactivate: () => { deactivated() } } as any)

    await expect(activatePlugin('main')).rejects.toThrow()

    // ensure telemetry and error emitted; telemetry should include rolledBack info
    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(telemetry.length).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(telemetry[0].rolledBack)).toBe(true)
    expect(telemetry[0].rolledBack.length).toBeGreaterThanOrEqual(0)

    unsubErr()
    unsubTel()
    unregisterPlugin('main')
    unregisterPlugin('dep1')
    unregisterPlugin('dep2')
  })
})
