/**
 * UniAdapter 核心层统一导出
 * 
 * 提供多端适配框架的核心功能导出
 * 包括适配器、平台检测、统一API等
 */

// 适配器
export * from './adapters'

// 平台检测
export { platformDetection, detectPlatform } from './platform-detector'

// 核心适配器
export { VERSION, initUniAdapter } from './adapter'

// 类型定义
export type { Platform, PlatformCapabilities } from './types/platform'
