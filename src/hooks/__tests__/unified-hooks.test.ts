import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUniState } from '../useUniState'
import { useUniRouter } from '../useUniRouter'
import { useUniRequest } from '../useUniRequest'
import { usePlatform } from '../usePlatform'

describe('Unified Hooks', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      } as any)
    ) as any
  })

  it('should create useUniState hook', () => {
    const { result } = renderHook(() => useUniState('initial'))
    expect(result.current[0]).toBe('initial')
    expect(typeof result.current[1]).toBe('function')
  })

  it('should create useUniRouter hook', () => {
    const { result } = renderHook(() => useUniRouter())
    expect(typeof result.current.push).toBe('function')
    expect(typeof result.current.replace).toBe('function')
    expect(typeof result.current.goBack).toBe('function')
  })

  it('should create useUniRequest hook', () => {
    const { result } = renderHook(() => useUniRequest())
    expect(typeof result.current.get).toBe('function')
    expect(typeof result.current.post).toBe('function')
    expect(typeof result.current.put).toBe('function')
    expect(typeof result.current.del).toBe('function')
  })

  it('should create usePlatform hook', () => {
    const { result } = renderHook(() => usePlatform())
    expect(result.current).toBeDefined()
  })

  it('should handle state updates', () => {
    const { result } = renderHook(() => useUniState(0))
    expect(typeof result.current[1]).toBe('function')
  })

  it('should handle router navigation without throwing', () => {
    const { result } = renderHook(() => useUniRouter())
    expect(() => result.current.push('/test')).not.toThrow()
    expect(() => result.current.replace('/test')).not.toThrow()
  })

  it('should handle HTTP requests without throwing', () => {
    const { result } = renderHook(() => useUniRequest())
    expect(() => result.current.get('/api/test')).not.toThrow()
    expect(() => result.current.post('/api/test', {})).not.toThrow()
  })
})
