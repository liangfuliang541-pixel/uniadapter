import { describe, it, expect, vi } from 'vitest'
import { registerPlugin, unregisterPlugin, activatePlugin } from '../plugin'

describe('activatePlugin config options', () => {
  it('calls onRetry when attempts fail and respects timeout', async () => {
    const onRetry = vi.fn()
    // plugin that never resolves activation (simulates hang)
    registerPlugin({ name: 'hang-plugin', activate: () => new Promise(() => {}), deactivate: () => {} } as any)

    await expect(activatePlugin('hang-plugin', undefined, { maxAttempts: 2, timeoutMs: 10, onRetry })).rejects.toThrow()
    expect(onRetry).toHaveBeenCalled()

    unregisterPlugin('hang-plugin')
  })
})
