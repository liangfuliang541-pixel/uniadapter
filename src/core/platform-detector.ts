/**
 * 平台检测和适配器工厂
 * 简化版本，避免复杂的类型错误
 */

/**
 * 平台类型枚举
 */
export enum PlatformType {
  WEB = 'web',
  MINI_PROGRAM = 'mini-program',
  REACT_NATIVE = 'react-native',
  UNKNOWN = 'unknown'
}

/**
 * 平台检测结果
 */
export interface PlatformDetection {
  type: PlatformType
  isWeb: boolean
  isMiniProgram: boolean
  isReactNative: boolean
  userAgent?: string
  platformInfo: Record<string, any>
}

/**
 * 检测当前运行平台
 * @returns 平台检测结果
 */
export function detectPlatform(): PlatformDetection {
  // 检测小程序环境
  if (typeof (globalThis as any).wx !== 'undefined' && (globalThis as any).wx.createCanvas) {
    return {
      type: PlatformType.MINI_PROGRAM,
      isWeb: false,
      isMiniProgram: true,
      isReactNative: false,
      platformInfo: {
        platform: 'wechat-mini-program',
        version: (globalThis as any).wx?.version || 'unknown'
      }
    }
  }

  // 检测React Native环境
  if (typeof navigator !== 'undefined' && (navigator as any).product === 'ReactNative') {
    return {
      type: PlatformType.REACT_NATIVE,
      isWeb: false,
      isMiniProgram: false,
      isReactNative: true,
      platformInfo: {
        platform: 'react-native',
        os: typeof (globalThis as any).Platform !== 'undefined' ? (globalThis as any).Platform.OS : 'unknown'
      }
    }
  }

  // 检测Web环境
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return {
      type: PlatformType.WEB,
      isWeb: true,
      isMiniProgram: false,
      isReactNative: false,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      platformInfo: {
        platform: 'web',
        browser: getBrowserInfo()
      }
    }
  }

  return {
    type: PlatformType.UNKNOWN,
    isWeb: false,
    isMiniProgram: false,
    isReactNative: false,
    platformInfo: {
      platform: 'unknown'
    }
  }
}

/**
 * 获取浏览器信息
 * @returns 浏览器信息
 */
function getBrowserInfo(): Record<string, string> {
  if (typeof navigator === 'undefined') return {}
  
  const ua = navigator.userAgent
  const info: Record<string, string> = {}
  
  // 检测主流浏览器
  if (ua.includes('Chrome')) {
    info.name = 'Chrome'
  } else if (ua.includes('Firefox')) {
    info.name = 'Firefox'
  } else if (ua.includes('Safari')) {
    info.name = 'Safari'
  } else if (ua.includes('Edge')) {
    info.name = 'Edge'
  }
  
  // 提取版本号
  const versionMatch = ua.match(/(Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/)
  if (versionMatch) {
    info.version = versionMatch[2]
  }
  
  return info
}

/**
 * 全局平台检测结果
 */
export const platformDetection = detectPlatform()