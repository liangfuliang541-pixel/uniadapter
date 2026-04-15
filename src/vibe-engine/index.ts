/**
 * UniAdapter VibeEngine - 入口
 *
 * @example VibeEngine（代码生成）
 * import { VibeEngine } from '@liangfu/uniadapter/vibe'
 *
 * const engine = new VibeEngine({ platform: 'weapp' })
 * const result = await engine.generate({
 *   prompt: '用户登录并保存 token',
 *   apiKey: process.env.OPENAI_API_KEY,
 * })
 * console.log(result.code)
 *
 * @example VibeStudio（可视化 IDE）
 * import { VibeStudio } from '@liangfu/uniadapter/vibe'
 *
 * const studio = new VibeStudio(document.getElementById('app')!, {
 *   defaultPrompt: '用户登录并保存 token',
 *   defaultPlatform: 'weapp',
 * })
 */
export { VibeEngine, type VibeGenerateOptions, type VibeGenerateResult, type VibeIntent } from './engine'
export { VibeStudio, type VibeStudioConfig, type VibeStudioConfig } from './studio'
