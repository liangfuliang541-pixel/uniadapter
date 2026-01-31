// UniAdapter - 智能多端适配器框架
// 统一导出所有公共API

// 核心适配器
export { UniAdapter } from './core/adapter'

// Hooks
export { usePlatform } from './hooks/usePlatform'
export { useUniState } from './hooks/useUniState'
export { useUniRouter } from './hooks/useUniRouter'
export { useUniRequest } from './hooks/useUniRequest'

// 平台检测
export { platformDetection } from './core/platform-detector'

// 存储适配器
export { storage } from './platforms/storage'