/**
 * HarmonyOS 适配器雏形
 * 提供最小实现以接入 UniAdapter 适配器工厂
 */
import { Platform } from '../types/platform'
import type {
  IStorageAdapter,
  IPlatformService
} from './interfaces'

// 简易基于 localStorage 的存储适配器实现（鸿蒙 Web 环境或 JS 运行时回退）
export class HarmonyOSStorageAdapter implements IStorageAdapter {
  platform: Platform = Platform.HARMONYOS

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
      return raw ? (JSON.parse(raw) as T) : null
    } catch (e) {
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (e) {
      // noop
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key)
    } catch (e) {}
  }

  async clear(): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') localStorage.clear()
    } catch (e) {}
  }

  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const res: Record<string, T | null> = {}
    for (const k of keys) res[k] = await this.get<T>(k)
    return res
  }

  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    for (const k in items) await this.set(k, items[k])
  }

  async getStorageInfo(): Promise<{ used: number; total: number }> {
    // 无法精确获取，返回占位信息
    return { used: 0, total: 0 }
  }
}

// 最小平台服务实现
export class HarmonyOSPlatformService implements IPlatformService {
  platform: Platform = Platform.HARMONYOS
  capabilities = {
    hasCamera: true,
    hasLocation: true,
    hasBiometric: true,
    hasNotification: true,
    hasShare: true,
    hasFileSystem: true,
    maxPhotoSize: 8192,
    storageQuota: 1024 * 1024 * 50
  }

  // 适配器实例（仅实现 storage 为示例）
  storage = new HarmonyOSStorageAdapter()
  // 使用占位实现以满足接口
  crypto: any = null
  file: any = null
  notification: any = null
  biometric: any = null
  share: any = null

  async getSystemInfo() {
    const ua = typeof navigator !== 'undefined' ? (navigator as any).userAgent : 'HarmonyOS'
    return {
      platform: 'HarmonyOS',
      version: ua,
      screenWidth: typeof screen !== 'undefined' ? (screen as any).width || 0 : 0,
      screenHeight: typeof screen !== 'undefined' ? (screen as any).height || 0 : 0,
      safeArea: { top: 0, bottom: 0 }
    }
  }

  vibrate(type: 'light' | 'medium' | 'heavy'): void {
    try {
      if (typeof (navigator as any).vibrate === 'function') {
        ;(navigator as any).vibrate(50)
      }
    } catch (e) {}
  }

  async openUrl(url: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') window.open(url, '_blank')
    } catch (e) {}
  }
}
// 导出适配器工厂需要的类名
export default HarmonyOSPlatformService
