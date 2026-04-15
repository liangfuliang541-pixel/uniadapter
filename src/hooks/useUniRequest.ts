import { useCallback, useRef } from 'react'
import { detectPlatform, Platform } from '../core/types/platform'

interface RequestOptions extends RequestInit {
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** 请求头 */
  headers?: Record<string, string>
}

/**
 * 请求错误类
 */
export class RequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}

/**
 * 请求拦截器类型
 */
export interface RequestInterceptor {
  request?: (config: RequestOptions & { url: string }) => RequestOptions & { url: string }
  response?: (response: any) => any
  error?: (error: RequestError) => RequestError | Promise<RequestError>
}

/**
 * 统一网络请求 Hook
 * 在不同平台下自动使用对应的请求 API，支持拦截器和统一错误处理
 *
 * @example
 * const { get, post, put, del, interceptors } = useUniRequest()
 * const data = await get('/api/user')
 * await post('/api/user', { name: 'Alice' })
 *
 * // 添加拦截器
 * interceptors.request.use((config) => {
 *   config.headers = { ...config.headers, Authorization: 'Bearer token' }
 *   return config
 * })
 */
export function useUniRequest() {
  const platform = detectPlatform()
  const requestInterceptors = useRef<Array<(config: any) => any>>([])
  const responseInterceptors = useRef<Array<(response: any) => any>>([])
  const errorInterceptors = useRef<Array<(error: RequestError) => any>>([])

  const resolveUrl = useCallback((url: string): string => {
    if (typeof url !== 'string') return url
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:3000'
    return new URL(url, base).toString()
  }, [])

  /**
   * 执行请求拦截器
   */
  const applyRequestInterceptors = useCallback((config: any) => {
    let finalConfig = config
    for (const interceptor of requestInterceptors.current) {
      finalConfig = interceptor(finalConfig)
    }
    return finalConfig
  }, [])

  /**
   * 执行响应拦截器
   */
  const applyResponseInterceptors = useCallback((response: any) => {
    let finalResponse = response
    for (const interceptor of responseInterceptors.current) {
      finalResponse = interceptor(finalResponse)
    }
    return finalResponse
  }, [])

  /**
   * 执行错误拦截器
   */
  const applyErrorInterceptors = useCallback((error: RequestError) => {
    let finalError = error
    for (const interceptor of errorInterceptors.current) {
      const result = interceptor(finalError)
      if (result instanceof RequestError) {
        finalError = result
      }
    }
    return finalError
  }, [])

  /**
   * 处理平台特定的错误
   */
  const handlePlatformError = useCallback((err: any, platform: Platform): RequestError => {
    let message = '网络请求失败'
    let code = 'UNKNOWN_ERROR'
    let status: number | undefined

    if (err instanceof RequestError) {
      return err
    }

    if (err?.message?.includes('abort')) {
      message = '请求超时'
      code = 'TIMEOUT'
    } else if (err?.message) {
      message = err.message
      code = err.code || 'REQUEST_FAILED'
    }

    // 平台特定的错误处理
    if (platform === Platform.WEAPP || platform === Platform.DOUYIN_MINIPROGRAM || 
        platform === Platform.ALIPAY_MINIPROGRAM || platform === Platform.XIAOHONGSHU) {
      if (err?.statusCode) {
        status = err.statusCode
      }
    }

    return new RequestError(message, code, status, err)
  }, [])

  const get = useCallback(async (url: string, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000

    let config = applyRequestInterceptors({ url: resolvedUrl, ...options })

    try {
      switch (platform) {
        case Platform.DOUYIN_MINIPROGRAM:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).tt?.request?.({
              url: config.url,
              method: 'GET',
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        case Platform.WEAPP:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).wx?.request?.({
              url: config.url,
              method: 'GET',
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        case Platform.ALIPAY_MINIPROGRAM:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).my?.httpRequest?.({
              url: config.url,
              method: 'GET',
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        default: {
          const controller = new AbortController()
          const timer = setTimeout(() => controller.abort(), timeout)
          try {
            const res = await fetch(config.url, { method: 'GET', signal: controller.signal, ...options })
            clearTimeout(timer)
            if (!res.ok) {
              throw new RequestError(`HTTP ${res.status}`, 'HTTP_ERROR', res.status)
            }
            const data = await res.json()
            return applyResponseInterceptors(data)
          } catch (e: any) {
            clearTimeout(timer)
            throw handlePlatformError(e, platform)
          }
        }
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw applyErrorInterceptors(error)
      }
      throw applyErrorInterceptors(handlePlatformError(error, platform))
    }
  }, [platform, resolveUrl, applyRequestInterceptors, applyResponseInterceptors, applyErrorInterceptors, handlePlatformError])

  const post = useCallback(async (url: string, data?: any, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000
    const headers = { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }

    let config = applyRequestInterceptors({ url: resolvedUrl, headers, ...options })

    try {
      switch (platform) {
        case Platform.DOUYIN_MINIPROGRAM:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).tt?.request?.({
              url: config.url,
              method: 'POST',
              data,
              header: config.headers,
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        case Platform.WEAPP:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).wx?.request?.({
              url: config.url,
              method: 'POST',
              data,
              header: config.headers,
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        case Platform.ALIPAY_MINIPROGRAM:
          return await new Promise((resolve, reject) => {
            ;(globalThis as any).my?.httpRequest?.({
              url: config.url,
              method: 'POST',
              data,
              header: config.headers,
              ...config,
              success: (res: any) => {
                try {
                  const response = applyResponseInterceptors(res.data)
                  resolve(response)
                } catch (e) {
                  reject(new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, e))
                }
              },
              fail: (err: any) => reject(handlePlatformError(err, platform)),
            })
          })
        default: {
          const controller = new AbortController()
          const timer = setTimeout(() => controller.abort(), timeout)
          try {
            const res = await fetch(config.url, {
              method: 'POST',
              headers: config.headers,
              body: data != null ? JSON.stringify(data) : undefined,
              signal: controller.signal,
              ...options,
            })
            clearTimeout(timer)
            if (!res.ok) {
              throw new RequestError(`HTTP ${res.status}`, 'HTTP_ERROR', res.status)
            }
            const responseData = await res.json()
            return applyResponseInterceptors(responseData)
          } catch (e: any) {
            clearTimeout(timer)
            throw handlePlatformError(e, platform)
          }
        }
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw applyErrorInterceptors(error)
      }
      throw applyErrorInterceptors(handlePlatformError(error, platform))
    }
  }, [platform, resolveUrl, applyRequestInterceptors, applyResponseInterceptors, applyErrorInterceptors, handlePlatformError])

  const put = useCallback(async (url: string, data?: any, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000
    const headers = { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }

    let config = applyRequestInterceptors({ url: resolvedUrl, headers, ...options })

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(config.url, {
        method: 'PUT',
        headers: config.headers,
        body: data != null ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      })
      clearTimeout(timer)
      if (!res.ok) {
        throw new RequestError(`HTTP ${res.status}`, 'HTTP_ERROR', res.status)
      }
      const responseData = await res.json()
      return applyResponseInterceptors(responseData)
    } catch (e: any) {
      clearTimeout(timer)
      throw handlePlatformError(e, platform)
    }
  }, [resolveUrl, platform, applyRequestInterceptors, applyResponseInterceptors, handlePlatformError])

  const del = useCallback(async (url: string, options?: RequestOptions): Promise<any> => {
    const resolvedUrl = resolveUrl(url)
    const timeout = options?.timeout ?? 10000

    let config = applyRequestInterceptors({ url: resolvedUrl, ...options })

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(config.url, {
        method: 'DELETE',
        signal: controller.signal,
        ...options,
      })
      clearTimeout(timer)
      if (!res.ok) {
        throw new RequestError(`HTTP ${res.status}`, 'HTTP_ERROR', res.status)
      }
      const responseData = await res.json()
      return applyResponseInterceptors(responseData)
    } catch (e: any) {
      clearTimeout(timer)
      throw handlePlatformError(e, platform)
    }
  }, [resolveUrl, platform, applyRequestInterceptors, applyResponseInterceptors, handlePlatformError])

  return {
    get,
    post,
    put,
    del,
    // 拦截器 API
    interceptors: {
      request: {
        use: (interceptor: (config: any) => any) => {
          requestInterceptors.current.push(interceptor)
          return () => {
            const index = requestInterceptors.current.indexOf(interceptor)
            if (index > -1) requestInterceptors.current.splice(index, 1)
          }
        },
      },
      response: {
        use: (interceptor: (response: any) => any) => {
          responseInterceptors.current.push(interceptor)
          return () => {
            const index = responseInterceptors.current.indexOf(interceptor)
            if (index > -1) responseInterceptors.current.splice(index, 1)
          }
        },
      },
      error: {
        use: (interceptor: (error: RequestError) => any) => {
          errorInterceptors.current.push(interceptor)
          return () => {
            const index = errorInterceptors.current.indexOf(interceptor)
            if (index > -1) errorInterceptors.current.splice(index, 1)
          }
        },
      },
    },
  }
}
