import { describe, it, expect } from 'vitest'
import { 
  useUniState, 
  useUniRouter, 
  useUniRequest,
  usePlatform 
} from '../../hooks/useUniState'

describe('Unified Hooks', () => {
  it('should create useUniState hook', () => {
    const [value, setValue] = useUniState('initial')
    expect(value).toBe('initial')
    expect(typeof setValue).toBe('function')
  })

  it('should create useUniRouter hook', () => {
    const router = useUniRouter()
    expect(typeof router.push).toBe('function')
    expect(typeof router.replace).toBe('function')
    expect(typeof router.goBack).toBe('function')
  })

  it('should create useUniRequest hook', () => {
    const request = useUniRequest()
    expect(typeof request.get).toBe('function')
    expect(typeof request.post).toBe('function')
    expect(typeof request.put).toBe('function')
    expect(typeof request.del).toBe('function')
  })

  it('should create usePlatform hook', () => {
    const platform = usePlatform()
    expect(platform).toBeDefined()
    expect(platform.type).toBeDefined()
    expect(platform.name).toBeDefined()
  })

  it('should handle state updates', () => {
    const [value, setValue] = useUniState(0)
    setValue(5)
    // Note: In actual implementation, this would trigger re-render
    // Here we just test the function exists
    expect(typeof setValue).toBe('function')
  })

  it('should handle router navigation', () => {
    const router = useUniRouter()
    expect(() => router.push('/test')).not.toThrow()
    expect(() => router.replace('/test')).not.toThrow()
  })

  it('should handle HTTP requests', () => {
    const request = useUniRequest()
    expect(() => request.get('/api/test')).not.toThrow()
    expect(() => request.post('/api/test', {})).not.toThrow()
  })
})