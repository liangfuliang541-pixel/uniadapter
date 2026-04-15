import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUniState } from './useUniState'

describe('useUniState Hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useUniState('test'))
    expect(result.current[0]).toBe('test')
  })

  it('should initialize with number value', () => {
    const { result } = renderHook(() => useUniState(42))
    expect(result.current[0]).toBe(42)
  })

  it('should update state', () => {
    const { result } = renderHook(() => useUniState(0))
    act(() => {
      result.current[1](5)
    })
    expect(result.current[0]).toBe(5)
  })

  it('should update state with function', () => {
    const { result } = renderHook(() => useUniState(10))
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    expect(result.current[0]).toBe(11)
  })
})
