import { useState, useEffect } from 'react'
import { platformDetection } from '../core/platform-detector'

/**
 * 平台信息Hook
 * 自动检测当前运行平台并提供平台相关信息
 */
export function usePlatform() {
  const [platform, setPlatform] = useState<any>(null)

  useEffect(() => {
    setPlatform(platformDetection)
  }, [])

  return platform
}

/**
 * 特定平台检测Hook
 */
export function useIsWeb() {
  const platform = usePlatform()
  return platform?.isWeb ?? false
}

export function useIsMiniProgram() {
  const platform = usePlatform()
  return platform?.isMiniProgram ?? false
}

export function useIsApp() {
  const platform = usePlatform()
  return platform?.type === 'react-native' || false
}

export function useIsMobile() {
  const platform = usePlatform()
  return platform?.isMiniProgram || platform?.type === 'react-native' || false
}