import { describe, it, expect } from 'vitest'
import { useUniState } from './useUniState'

describe('useUniState Hook', () => {
  it('should initialize with default value', () => {
    const [value] = useUniState('test')
    expect(value).toBe('test')
  })
})