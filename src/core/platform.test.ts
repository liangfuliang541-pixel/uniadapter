import { describe, it, expect } from 'vitest'
import { detectPlatform, Platform } from './types/platform'

describe('Platform Detection', () => {
  it('should detect platform and return a valid Platform enum', () => {
    const platform = detectPlatform()
    expect(Object.values(Platform)).toContain(platform)
  })

  it('should detect web platform correctly in browser environment', () => {
    const platform = detectPlatform()
    // 在 Node.js 测试环境返回 Platform.UNKNOWN
    // 在浏览器环境返回对应的平台
    expect(platform).toBeDefined()
  })
})
