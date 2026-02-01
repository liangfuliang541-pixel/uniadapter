/**
 * 平台类型定义
 */

export enum Platform {
  H5 = 'h5',
  WEAPP = 'weapp',
  DOUYIN_MINIPROGRAM = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  REACT_NATIVE = 'react-native',
  GAODE_MAP = 'amap',
  GO_DISTRIBUTED = 'go-distributed',
  UNKNOWN = 'unknown'
}

export interface PlatformCapabilities {
  hasCamera: boolean
  hasLocation: boolean
  hasBiometric: boolean
  hasNotification: boolean
  hasShare: boolean
  hasFileSystem: boolean
  maxPhotoSize: number
  storageQuota: number
}

/**
 * 检测当前运行平台
 * @returns Platform 枚举值
 */
export function detectPlatform(): Platform {
  // 检测Go分布式环境
  if (typeof (globalThis as any).go !== 'undefined' && (globalThis as any).go.runtime === 'distributed') {
    return Platform.GO_DISTRIBUTED
  }
  
  // 检测抖音小程序
  if (typeof (globalThis as any).tt !== 'undefined') {
    return Platform.DOUYIN_MINIPROGRAM
  }
  
  // 检测小红书小程序
  if (typeof (globalThis as any).xhs !== 'undefined') {
    return Platform.XIAOHONGSHU
  }
  
  // 检测微信小程序
  if (typeof (globalThis as any).wx !== 'undefined') {
    return Platform.WEAPP
  }
  
  // 检测React Native
  if (typeof navigator !== 'undefined' && (navigator as any).product === 'ReactNative') {
    return Platform.REACT_NATIVE
  }
  
  // 检测高德地图环境
  if (typeof (globalThis as any).AMap !== 'undefined' || (globalThis as any).AMap) {
    return Platform.GAODE_MAP
  }
  
  // 检测Web环境
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return Platform.H5
  }
  
  return Platform.UNKNOWN
}