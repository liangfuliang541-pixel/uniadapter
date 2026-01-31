import { platformDetection } from '../core/platform-detector'

/**
 * 统一网络请求Hook
 * 根据不同平台自动适配网络请求方式
 */
export function useUniRequest() {
  const platform = platformDetection

  const request = async (options: {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    headers?: Record<string, string>
  }) => {
    const { url, method = 'GET', data, headers = {} } = options

    if (platform.isWeb) {
      // Web端使用fetch
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined
      })
      return response.json()
    } else {
      // 其他平台也使用fetch作为通用实现
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined
      })
      return response.json()
    }
  }

  return { request }
}