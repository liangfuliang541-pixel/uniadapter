import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUniPlugin } from '../useUniPlugin'
import { unregisterPlugin } from '../../core/plugin'

describe('useUniPlugin hook', () => {
  it('receives events via callback and respects priority ordering', async () => {
    const events: any[] = []
    const { result } = renderHook(() => useUniPlugin((p) => events.push(p)))

    act(() => {
      result.current.register({ name: 'p-low', priority: 1 })
      result.current.register({ name: 'p-high', priority: 10 })
    })

    const list = result.current.list().map((p: any) => p.name)
    expect(list[0]).toBe('p-high')
    expect(list[1]).toBe('p-low')

    // ensure callback received some events
    expect(events.length).toBeGreaterThanOrEqual(2)

    // cleanup
    unregisterPlugin('p-low')
    unregisterPlugin('p-high')
  })
})
