import { describe, it, expect, vi, beforeEach } from 'vitest'
import { detectPlatform, Platform } from '../../core/types/platform'

describe('Platform Detection - HarmonyOS', () => {
  beforeEach(() => {
    vi.resetModules()
    delete (globalThis as any).tt
    delete (globalThis as any).xhs
    delete (globalThis as any).wx
    delete (globalThis as any).AMap
    delete (globalThis as any).ohos
    delete (globalThis as any).hm
  })

  it('should detect HarmonyOS via userAgent', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (HarmonyOS) AppleWebKit' })
    expect(detectPlatform()).toBe(Platform.HARMONYOS)
  })

  it('should detect HarmonyOS via global ohos object', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0' })
    vi.stubGlobal('ohos', { version: '3.0' })
    expect(detectPlatform()).toBe(Platform.HARMONYOS)
  })
})
