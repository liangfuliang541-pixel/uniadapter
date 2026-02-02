/**
 * UniAdapter 核心适配器
 * 统一多端适配的入口文件
 */

import { platformDetection } from './platform-detector'

// 导出平台检测相关
export { PlatformType, platformDetection, detectPlatform } from './platform-detector'

// 导出核心Hook
export { useUniState, useUniRouter, useUniRequest, usePlatform } from '../hooks/useUniState'

// 导出类型定义
export type { PlatformDetection } from './platform-detector'

/**
 * UniAdapter 版本信息
 */
export const VERSION = '1.0.0'

/**
 * 初始化UniAdapter
 * @param options 初始化选项
 */
export function initUniAdapter(options?: { 
  debug?: boolean 
}): void {
  if (options?.debug) {
    console.log('UniAdapter initialized with debug mode')
    console.log('Platform detection:', platformDetection)
  }
}