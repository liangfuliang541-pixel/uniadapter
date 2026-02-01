import { describe, it, expect, vi, beforeEach } from 'vitest'
import { detectPlatform, Platform } from '../../core/types/platform'

describe('Platform Detection', () => {
  beforeEach(() => {
    vi.resetModules()
    // 重置全局对象
    delete (globalThis as any).tt
    delete (globalThis as any).xhs
    delete (globalThis as any).wx
    delete (globalThis as any).AMap
    vi.stubGlobal('navigator', {})
    vi.stubGlobal('window', {})
    vi.stubGlobal('document', {})
  })

  it('should detect H5 platform', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal('document', {})
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0' })
    
    expect(detectPlatform()).toBe(Platform.H5)
  })

  it('should detect Douyin Mini Program', () => {
    vi.stubGlobal('tt', { version: '1.0.0' })
    
    expect(detectPlatform()).toBe(Platform.DOUYIN_MINIPROGRAM)
  })

  it('should detect Xiaohongshu Mini Program', () => {
    vi.stubGlobal('xhs', { version: '1.0.0' })
    
    expect(detectPlatform()).toBe(Platform.XIAOHONGSHU)
  })

  it('should detect WeChat Mini Program', () => {
    vi.stubGlobal('wx', { version: '1.0.0' })
    
    expect(detectPlatform()).toBe(Platform.WEAPP)
  })

  it('should detect React Native', () => {
    vi.stubGlobal('navigator', { product: 'ReactNative' })
    
    expect(detectPlatform()).toBe(Platform.REACT_NATIVE)
  })

  it('should detect Gaode Map', () => {
    vi.stubGlobal('AMap', { version: '1.0.0' })
    
    expect(detectPlatform()).toBe(Platform.GAODE_MAP)
  })

  it('should return unknown for unsupported platform', () => {
    expect(detectPlatform()).toBe(Platform.UNKNOWN)
  })
})