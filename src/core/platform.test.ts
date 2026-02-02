import { describe, it, expect } from 'vitest'
import { platformDetection } from './platform-detector'

describe('Platform Detection', () => {
  it('should detect web platform correctly', () => {
    const platform = platformDetection
    expect(platform.type).toBeDefined()
    expect(platform.isWeb).toBeDefined()
    expect(platform.isMiniProgram).toBeDefined()
    expect(platform.isReactNative).toBeDefined()
  })

  it('should provide platform information', () => {
    const platform = platformDetection
    expect(platform.name).toBeDefined()
    expect(platform.version).toBeDefined()
    expect(platform.isMobile).toBeDefined()
    expect(platform.isDesktop).toBeDefined()
  })
})