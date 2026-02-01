/**
 * 平台适配器统一导出
 * 包含H5、小程序、APP、抖音、高德、小红书、Go分布式等多端支持
 */

import { Platform, detectPlatform } from '../types/platform'

// 懒加载各个平台适配器
export async function createStorageAdapter() {
  const platform = detectPlatform()
  switch (platform) {
    case Platform.DOUYIN_MINIPROGRAM: 
      return import('./douyin').then(mod => new mod.DouyinStorageAdapter())
    case Platform.GAODE_MAP: 
      return import('./amap').then(mod => new mod.AmapStorageAdapter())
    case Platform.XIAOHONGSHU: 
      return import('./xiaohongshu').then(mod => new mod.XiaohongshuStorageAdapter())
    case Platform.GO_DISTRIBUTED:
      return import('./go-distributed').then(mod => new mod.GoDistributedStorageAdapter())
    default:
      return import('./h5').then(mod => new mod.H5StorageAdapter())
  }
}

export async function createPlatformService() {
  const platform = detectPlatform()
  switch (platform) {
    case Platform.DOUYIN_MINIPROGRAM: 
      return import('./douyin').then(mod => new mod.DouyinPlatformService())
    case Platform.GAODE_MAP: 
      return import('./amap').then(mod => new mod.AmapPlatformService())
    case Platform.XIAOHONGSHU: 
      return import('./xiaohongshu').then(mod => new mod.XiaohongshuPlatformService())
    case Platform.GO_DISTRIBUTED:
      return import('./go-distributed').then(mod => new mod.GoDistributedPlatformService())
    default:
      return import('./h5').then(mod => new mod.H5PlatformService())
  }
}

// 导出平台检测器
export { platformDetection } from '../platform-detector'

// 导出平台类型
export { Platform, detectPlatform } from '../types/platform'

// 导出类型定义
export type { 
  IStorageAdapter,
  ICryptoAdapter,
  IFileAdapter,
  INotificationAdapter,
  IBiometricAdapter,
  IShareAdapter,
  IPlatformService,
  PlatformCapabilities
} from './interfaces'

// 导出Go分布式特定适配器
export {
  GoDistributedRPCAdapter,
  GoDistributedMessageQueueAdapter,
  GoDistributedServiceDiscoveryAdapter,
  GoDistributedLockAdapter
} from './go-distributed'