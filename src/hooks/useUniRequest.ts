import { useCallback } from 'react'
import { detectPlatform, Platform } from '../core/types/platform'

interface RequestOptions extends RequestInit {
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** 请求头 */
  headers?: Record<string, string>
}

/**
 * 统一网络请求 Hook
 * 在不同平台下自动使用对应的请求 API
 *
 * @example
 * const { get, post, put, del } = useUniRequest()
 * const data = await get('/api/user')
 * await post('/api/user', { name: 'Alice' })
 */
export function useUniRequest() {
  const platform = detectPlatform()

  const resolveUrl = useCallback((url: string): string => {
    if (typeof url !== 'string') return url
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:3000'
    return new URL(url, base).toString()
  }, [])

  const get = useCallback(async (url: string, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000

    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).tt?.request?.({
            url: resolvedUrl,
            method: 'GET',
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      case Platform.WEAPP:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).wx?.request?.({
            url: resolvedUrl,
            method: 'GET',
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      case Platform.ALIPAY_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).my?.httpRequest?.({
            url: resolvedUrl,
            method: 'GET',
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      default: {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeout)
        try {
          const res = await fetch(resolvedUrl, { method: 'GET', signal: controller.signal, ...options })
          clearTimeout(timer)
          return res.json()
        } catch (e: any) {
          clearTimeout(timer)
          throw e
        }
      }
    }
  }, [platform, resolveUrl])

  const post = useCallback(async (url: string, data?: any, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000
    const headers = { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }

    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).tt?.request?.({
            url: resolvedUrl,
            method: 'POST',
            data,
            header: headers,
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      case Platform.WEAPP:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).wx?.request?.({
            url: resolvedUrl,
            method: 'POST',
            data,
            header: headers,
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      case Platform.ALIPAY_MINIPROGRAM:
        return new Promise((resolve, reject) => {
          ;(globalThis as any).my?.httpRequest?.({
            url: resolvedUrl,
            method: 'POST',
            data,
            header: headers,
            ...options,
            success: (res: any) => resolve(res.data),
            fail: reject,
          })
        })
      default: {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeout)
        try {
          const res = await fetch(resolvedUrl, {
            method: 'POST',
            headers,
            body: data != null ? JSON.stringify(data) : undefined,
            signal: controller.signal,
            ...options,
          })
          clearTimeout(timer)
          return res.json()
        } catch (e: any) {
          clearTimeout(timer)
          throw e
        }
      }
    }
  }, [platform, resolveUrl])

  const put = useCallback(async (url: string, data?: any, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(resolvedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
        body: data != null ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      })
      clearTimeout(timer)
      return res.json()
    } catch (e: any) {
      clearTimeout(timer)
      throw e
    }
  }, [resolveUrl])

  const del = useCallback(async (url: string, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(resolvedUrl, { method: 'DELETE', signal: controller.signal, ...options })
      clearTimeout(timer)
      return res.json()
    } catch (e: any) {
      clearTimeout(timer)
      throw e
    }
  }, [resolveUrl])

  return { get, post, put, del }
}
