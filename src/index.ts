/**
 * UniAdapter - 跨端统一 API 框架
 * One API, Every Platform. Describe it, generate it.
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
 *
 * @example VibeEngine - 自然语言生成跨端代码
 * import { VibeEngine } from '@liangfu/uniadapter/vibe'
 *
 * const engine = new VibeEngine({ platform: 'weapp' })
 * const result = await engine.generate({
 *   prompt: '显示一个下拉刷新列表',
 *   apiKey: process.env.OPENAI_API_KEY,
 * })
 * console.log(result.code) // 微信小程序最优实现
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

// VibeEngine
export { VibeEngine } from './vibe-engine'
export { VibeStudio } from './vibe-engine/studio'
export type { VibeGenerateOptions, VibeGenerateResult, VibeIntent } from './vibe-engine'
export type { VibeStudioConfig } from './vibe-engine/studio'

// Types
export type {
  IStorageAdapter,
  IRequestAdapter,
  IPlatformService,
  IPlatformCapabilities,
} from './core/adapters/interfaces'
export { VibeUI, presetComponents, allComponentNames } from './components/registry'
export type { ComponentName, ComponentPlatform, ComponentEntry, ComponentSource, ComponentFile } from './components/registry'
