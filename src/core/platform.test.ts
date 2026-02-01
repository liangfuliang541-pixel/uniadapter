import { describe, it, expect } from 'vitest'
import { platformDetection } from './platform-detector'

describe('Platform Detection', () => {
  it('should detect web platform correctly', () => {
    const platform = platformDetection
    expect(platform.type).toBe('web')
    expect(platform.isWeb).toBe(true)
    expect(platform.isMiniProgram).toBe(false)
    expect(platform.isReactNative).toBe(false)
  })

  it('should provide platform information', () => {
    const platform = platformDetection
    expect(platform.name).toBeDefined()
    expect(platform.version).toBeDefined()
    expect(platform.isMobile).toBeDefined()
    expect(platform.isDesktop).toBeDefined()
  })
})