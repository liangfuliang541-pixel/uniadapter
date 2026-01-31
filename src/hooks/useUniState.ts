import { useState, useEffect } from 'react'
import { platformDetection } from '../core/platform-detector'

/**
 * 统一状态管理Hook
 * 根据不同平台自动适配状态管理方式
 */
export function useUniState<T>(initialState: T | (() => T)) {
  const platform = platformDetection
  const [state, setState] = useState<T>(initialState)

  // 根据平台选择合适的持久化策略
  useEffect(() => {
    if (platform.isWeb) {
      // Web端使用localStorage
      const saved = localStorage.getItem('uni_state')
      if (saved) {
        try {
          setState(JSON.parse(saved))
        } catch (e) {
          console.warn('Failed to parse saved state:', e)
        }
      }
    } else if (platform.isMiniProgram) {
      // 小程序端使用storage
      const saved = sessionStorage.getItem('uni_state')
      if (saved) {
        try {
          setState(JSON.parse(saved))
        } catch (e) {
          console.warn('Failed to parse saved state:', e)
        }
      }
    }
  }, [platform])

  const setUniState = (newState: T | ((prevState: T) => T)) => {
    const updatedState = typeof newState === 'function' 
      ? (newState as (prevState: T) => T)(state)
      : newState
    
    setState(updatedState)
    
    // 自动持久化
    if (platform.isWeb) {
      localStorage.setItem('uni_state', JSON.stringify(updatedState))
    } else if (platform.isMiniProgram) {
      sessionStorage.setItem('uni_state', JSON.stringify(updatedState))
    }
  }

  return [state, setUniState] as const
}