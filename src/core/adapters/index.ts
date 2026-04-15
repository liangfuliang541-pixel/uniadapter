/**
 * 平台适配器统一导出
 * 包含 H5、支付宝小程序、抖音小程序、小红书、高德地图 等平台支持
 */

import { Platform, detectPlatform } from '../types/platform'

// 懒加载各个平台适配器
export async function createStorageAdapter() {
  const platform = detectPlatform()
  switch (platform) {
    case Platform.ALIPAY_MINIPROGRAM:
      return import('./alipay').then(mod => new mod.AlipayStorageAdapter())
    case Platform.DOUYIN_MINIPROGRAM:
      return import('./douyin').then(mod => new mod.DouyinStorageAdapter())
    case Platform.XIAOHONGSHU:
      return import('./xiaohongshu').then(mod => new mod.XiaohongshuStorageAdapter())
    case Platform.GAODE_MAP:
      return import('./amap').then(mod => new mod.AmapStorageAdapter())
    case Platform.H5:
    default:
      return import('./h5').then(mod => new mod.H5StorageAdapter())
  }
}

export async function createPlatformService() {
  const platform = detectPlatform()
  switch (platform) {
    case Platform.ALIPAY_MINIPROGRAM:
      return import('./alipay').then(mod => new mod.AlipayPlatformService())
    case Platform.DOUYIN_MINIPROGRAM:
      return import('./douyin').then(mod => new mod.DouyinPlatformService())
    case Platform.XIAOHONGSHU:
      return import('./xiaohongshu').then(mod => new mod.XiaohongshuPlatformService())
    case Platform.GAODE_MAP:
      return import('./amap').then(mod => new mod.AmapPlatformService())
    case Platform.H5:
    default:
      return import('./h5').then(mod => new mod.H5PlatformService())
  }
}

// 导出平台检测
export { detectPlatform } from '../types/platform'
export { Platform } from '../types/platform'

// 导出类型定义
export type {
  IStorageAdapter,
  ICryptoAdapter,
  IFileAdapter,
  INotificationAdapter,
  IBiometricAdapter,
  IShareAdapter,
  IPlatformService,
  IPlatformCapabilities,
  PlatformCapabilities,
} from './interfaces'

// 导出各平台适配器类
export { H5StorageAdapter, H5CryptoAdapter, H5FileAdapter, H5PlatformService } from './h5'
export { AlipayStorageAdapter, AlipayCryptoAdapter, AlipayFileAdapter, AlipayPlatformService } from './alipay'
export { DouyinStorageAdapter, DouyinCryptoAdapter, DouyinFileAdapter, DouyinPlatformService } from './douyin'
export { XiaohongshuStorageAdapter, XiaohongshuCryptoAdapter, XiaohongshuFileAdapter, XiaohongshuPlatformService } from './xiaohongshu'
export { AmapStorageAdapter, AmapCryptoAdapter, AmapFileAdapter, AmapPlatformService } from './amap'
