import { detectPlatform, Platform } from '../core/types/platform'

/**
 * 统一状态管理Hook
 * @param initialState 初始状态
 * @returns [state, setState] 状态和更新函数
 */
export function useUniState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void] {
  const state = initialState
  const setState = (newState: T | ((prev: T) => T)) => {
    console.log('State updated:', newState)
  }
  
  return [state, setState]
}

/**
 * 统一路由Hook
 * @returns 路由相关操作函数
 */
export function useUniRouter() {
  const platform = detectPlatform()
  
  const push = (url: string) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        (globalThis as any).tt.navigateTo({ url })
        break
      case Platform.XIAOHONGSHU:
        (globalThis as any).xhs.navigateTo({ url })
        break
      case Platform.WEAPP:
        (globalThis as any).wx.navigateTo({ url })
        break
      case Platform.H5:
        if (typeof window !== 'undefined') {
          window.location.href = url
        }
        break
      default:
        if (typeof window !== 'undefined') {
          window.location.href = url
        }
    }
  }
  
  const replace = (url: string) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        (globalThis as any).tt.redirectTo({ url })
        break
      case Platform.XIAOHONGSHU:
        (globalThis as any).xhs.redirectTo({ url })
        break
      case Platform.WEAPP:
        (globalThis as any).wx.redirectTo({ url })
        break
      case Platform.H5:
        if (typeof window !== 'undefined') {
          window.location.replace(url)
        }
        break
      default:
        if (typeof window !== 'undefined') {
          window.location.replace(url)
        }
    }
  }
  
  return { push, replace }
}

/**
 * 统一网络请求Hook
 * @returns 请求相关操作函数
 */
export function useUniRequest() {
  const platform = detectPlatform()
  
  const get = async (url: string, options?: RequestInit) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          (globalThis as any).tt.request({
            url,
            method: 'GET',
            success: resolve,
            fail: reject,
          })
        })
      case Platform.XIAOHONGSHU:
        return new Promise((resolve, reject) => {
          (globalThis as any).xhs.request({
            url,
            method: 'GET',
            success: resolve,
            fail: reject,
          })
        })
      case Platform.WEAPP:
        return new Promise((resolve, reject) => {
          (globalThis as any).wx.request({
            url,
            method: 'GET',
            success: resolve,
            fail: reject,
          })
        })
      default:
        const response = await fetch(url, { method: 'GET', ...options })
        return response.json()
    }
  }
  
  const post = async (url: string, data: any, options?: RequestInit) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          (globalThis as any).tt.request({
            url,
            method: 'POST',
            data,
            success: resolve,
            fail: reject,
          })
        })
      case Platform.XIAOHONGSHU:
        return new Promise((resolve, reject) => {
          (globalThis as any).xhs.request({
            url,
            method: 'POST',
            data,
            success: resolve,
            fail: reject,
          })
        })
      case Platform.WEAPP:
        return new Promise((resolve, reject) => {
          (globalThis as any).wx.request({
            url,
            method: 'POST',
            data,
            success: resolve,
            fail: reject,
          })
        })
      default:
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          ...options,
        })
        return response.json()
    }
  }
  
  return { get, post }
}

/**
 * 平台信息Hook
 * @returns 当前平台信息
 */
export function usePlatform() {
  const platform = detectPlatform()
  
  const platformInfo = {
    [Platform.H5]: {
      name: 'Web Browser',
      type: 'web',
      isWeb: true,
      isMiniProgram: false,
      isApp: false,
      isMobile: /Mobile|Android|iPhone|iPad/i.test(navigator?.userAgent || ''),
    },
    [Platform.WEAPP]: {
      name: 'WeChat Mini Program',
      type: 'mini-program',
      isWeb: false,
      isMiniProgram: true,
      isApp: false,
      isMobile: true,
    },
    [Platform.DOUYIN_MINIPROGRAM]: {
      name: 'Douyin Mini Program',
      type: 'mini-program',
      isWeb: false,
      isMiniProgram: true,
      isApp: false,
      isMobile: true,
    },
    [Platform.XIAOHONGSHU]: {
      name: 'Xiaohongshu Mini Program',
      type: 'mini-program',
      isWeb: false,
      isMiniProgram: true,
      isApp: false,
      isMobile: true,
    },
    [Platform.REACT_NATIVE]: {
      name: 'React Native App',
      type: 'app',
      isWeb: false,
      isMiniProgram: false,
      isApp: true,
      isMobile: true,
    },
    [Platform.GAODE_MAP]: {
      name: 'Gaode Map',
      type: 'map-service',
      isWeb: true,
      isMiniProgram: false,
      isApp: false,
      isMobile: /Mobile/i.test(navigator?.userAgent || ''),
    },
    [Platform.UNKNOWN]: {
      name: 'Unknown Platform',
      type: 'unknown',
      isWeb: false,
      isMiniProgram: false,
      isApp: false,
      isMobile: false,
    },
  }
  
  return platformInfo[platform] || platformInfo[Platform.UNKNOWN]
}