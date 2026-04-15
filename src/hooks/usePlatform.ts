import { useState, useEffect } from 'react'
import { detectPlatform, Platform } from '../core/types/platform'

/**
 * 平台信息Hook
 * 自动检测当前运行平台并提供平台相关信息
 */
export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>(Platform.H5)

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  return platform
}

/**
 * 特定平台检测 Hook
 */
export function useIsWeb() {
  const platform = usePlatform()
  return platform === Platform.H5
}

export function useIsMiniProgram() {
  const platform = usePlatform()
  return (
    platform === Platform.WEAPP ||
    platform === Platform.ALIPAY_MINIPROGRAM ||
    platform === Platform.DOUYIN_MINIPROGRAM ||
    platform === Platform.XIAOHONGSHU
  )
}

export function useIsApp() {
  const platform = usePlatform()
  return platform === Platform.REACT_NATIVE
}

export function useIsMobile() {
  const platform = usePlatform()
  return (
    platform === Platform.WEAPP ||
    platform === Platform.ALIPAY_MINIPROGRAM ||
    platform === Platform.DOUYIN_MINIPROGRAM ||
    platform === Platform.XIAOHONGSHU ||
    platform === Platform.REACT_NATIVE ||
    platform === Platform.HARMONYOS
  )
}
