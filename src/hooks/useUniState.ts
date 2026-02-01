import { platformDetection } from '../core/platform-detector'

/**
 * 统一状态管理Hook
 * @param initialState 初始状态
 * @returns [state, setState] 状态和更新函数
 */
export function useUniState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void] {
  // 简化实现，实际项目中可以集成zustand或其他状态管理库
  const state = initialState
  const setState = (newState: T | ((prev: T) => T)) => {
    // 状态更新逻辑
    console.log('State updated:', newState)
  }
  
  return [state, setState]
}

/**
 * 统一路由Hook
 * @returns 路由相关操作函数
 */
export function useUniRouter() {
  const push = (url: string) => {
    // 统一跳转逻辑
    if (typeof window !== 'undefined') {
      window.location.href = url
    }
  }
  
  const replace = (url: string) => {
    // 统一替换逻辑
    if (typeof window !== 'undefined') {
      window.location.replace(url)
    }
  }
  
  return { push, replace }
}

/**
 * 统一网络请求Hook
 * @returns 请求相关操作函数
 */
export function useUniRequest() {
  const get = async (url: string) => {
    // 统一GET请求逻辑
    try {
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }
  
  const post = async (url: string, data: any) => {
    // 统一POST请求逻辑
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }
  
  return { get, post }
}

/**
 * 平台信息Hook
 * @returns 当前平台信息
 */
export function usePlatform() {
  return platformDetection
}