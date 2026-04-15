/**
 * UniAdapter 核心适配器
 * 统一多端适配的入口文件
 */

import { detectPlatform } from './types/platform'

export { Platform, detectPlatform } from './types/platform'
export type { PlatformCapabilities } from './types/platform'

export const VERSION = '1.3.1'

export function initUniAdapter(options?: {
  debug?: boolean
}): void {
  const platform = detectPlatform()
  if (options?.debug) {
    console.log('[UniAdapter] Initialized', {
      version: VERSION,
      platform,
    })
  }
}
