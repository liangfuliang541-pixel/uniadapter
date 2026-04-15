/**
 * UniAdapter - 跨端统一 API 框架
 * One API, Every Platform
 *
 * 一套代码适配：Web / H5、支付宝小程序、微信小程序、抖音小程序、小红书小程序、高德地图
 *
 * @example
 * import { createStorageAdapter, useUniState } from '@liangfu/uniadapter'
 *
 * // 自动检测平台，返回对应适配器
 * const storage = await createStorageAdapter()
 * await storage.set('token', 'abc123')
 * const token = await storage.get('token') // 'abc123'
 */

export { createStorageAdapter, createPlatformService } from './core/adapters'
export { detectPlatform } from './core/types/platform'
export { Platform } from './core/types/platform'
export type { PlatformCapabilities } from './core/types/platform'

// Hooks
export { useUniState } from './hooks/useUniState'
export { useUniRouter } from './hooks/useUniRouter'
export { useUniRequest } from './hooks/useUniRequest'
export { usePlatform } from './hooks/usePlatform'

// Types
export type {
  IStorageAdapter,
  IPlatformService,
  IPlatformCapabilities,
} from './core/adapters/interfaces'
