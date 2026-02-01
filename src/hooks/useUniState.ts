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
      case Platform.GO_DISTRIBUTED:
        // 在Go分布式环境中，通过RPC调用进行路由跳转
        if (typeof (globalThis as any).go !== 'undefined' && (globalThis as any).go.router) {
          (globalThis as any).go.router.push(url)
        } else {
          console.warn('Router not available in this environment')
        }
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
      case Platform.GO_DISTRIBUTED:
        // 在Go分布式环境中，通过RPC调用进行路由替换
        if (typeof (globalThis as any).go !== 'undefined' && (globalThis as any).go.router) {
          (globalThis as any).go.router.replace(url)
        } else {
          console.warn('Router not available in this environment')
        }
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
      case Platform.GO_DISTRIBUTED:
        // 在Go分布式环境中，通过RPC调用进行HTTP GET请求
        if (typeof (globalThis as any).go !== 'undefined' && (globalThis as any).go.http) {
          return await (globalThis as any).go.http.get(url, options)
        } else {
          // 如果没有Go HTTP客户端，回退到标准fetch
          const response = await fetch(url, { method: 'GET', ...options })
          return response.json()
        }
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
      case Platform.GO_DISTRIBUTED:
        // 在Go分布式环境中，通过RPC调用进行HTTP POST请求
        if (typeof (globalThis as any).go !== 'undefined' && (globalThis as any).go.http) {
          return await (globalThis as any).go.http.post(url, data, options)
        } else {
          // 如果没有Go HTTP客户端，回退到标准fetch
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
    [Platform.GO_DISTRIBUTED]: {
      name: 'Go Distributed System',
      type: 'distributed',
      isWeb: false,
      isMiniProgram: false,
      isApp: false,
      isMobile: false,
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