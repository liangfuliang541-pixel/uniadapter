/**
 * UniAdapter 核心层统一导出
 */

// 适配器
export * from './adapters'

// 平台检测
export { detectPlatform } from './types/platform'
export { Platform } from './types/platform'

// 核心适配器
export { VERSION, initUniAdapter } from './adapter'

// 类型定义
export type { PlatformCapabilities } from './types/platform'