/**
 * 平台类型定义
 */

export enum Platform {
  H5 = 'h5',
  WEAPP = 'weapp',
  HARMONYOS = 'harmonyos',
  DOUYIN_MINIPROGRAM = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  ALIPAY_MINIPROGRAM = 'alipay',
  REACT_NATIVE = 'react-native',
  GAODE_MAP = 'amap',
  GO_DISTRIBUTED = 'go-distributed',
  NEXT_JS = 'nextjs',
  NUXT = 'nuxt',
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
  
  // 检测支付宝小程序
  if (typeof (globalThis as any).my !== 'undefined' && (globalThis as any).my.canIUse) {
    return Platform.ALIPAY_MINIPROGRAM
  }

  // 检测鸿蒙 / HarmonyOS (通过 userAgent 或全局对象识别)
  try {
    const ua = typeof navigator !== 'undefined' && (navigator as any).userAgent ? (navigator as any).userAgent : ''
    if (ua && /HarmonyOS|harmonyos|harmony/i.test(ua)) {
      return Platform.HARMONYOS
    }
  } catch (e) {
    // ignore
  }

  if (typeof (globalThis as any).ohos !== 'undefined' || typeof (globalThis as any).hm !== 'undefined') {
    return Platform.HARMONYOS
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
    // Detect Next.js client runtime
    try {
      if (typeof (globalThis as any).__NEXT_DATA__ !== 'undefined') {
        return Platform.NEXT_JS
      }
    } catch (e) {}

    // Detect Nuxt client runtime
    try {
      if (typeof (globalThis as any).__NUXT__ !== 'undefined') {
        return Platform.NUXT
      }
    } catch (e) {}

    return Platform.H5
  }
  
  return Platform.UNKNOWN
}