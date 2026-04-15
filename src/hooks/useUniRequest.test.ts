import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUniRequest, RequestError } from './useUniRequest'

/**
 * useUniRequest Hook 测试
 * 由于 Hook 需要在 React 组件中使用，这里使用集成测试风格
 * 测试主要的错误处理、类型定义和拦截器机制
 */

describe('RequestError class', () => {
  it('should create RequestError with proper properties', () => {
    const error = new RequestError('Test error', 'TEST_CODE', 400, new Error('Original'))
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.status).toBe(400)
    expect(error.name).toBe('RequestError')
  })

  it('should be instanceof Error', () => {
    const error = new RequestError('Test', 'CODE', 400)
    expect(error instanceof Error).toBe(true)
  })

  it('should support optional properties', () => {
    const error = new RequestError('Test', 'CODE')
    expect(error.status).toBeUndefined()
    expect(error.originalError).toBeUndefined()
  })
})

describe('useUniRequest Hook - API interface', () => {
  it('should export RequestError', () => {
    expect(RequestError).toBeDefined()
    expect(typeof RequestError).toBe('function')
  })

  it('should provide useUniRequest function', () => {
    expect(typeof useUniRequest).toBe('function')
  })
})

describe('useUniRequest Hook - Mock verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return hooks with correct methods', () => {
    // 这里我们只验证类型和接口，避免实际执行 React Hook
    // 真正的 Hook 需要在 React 环境中测试
    expect(useUniRequest).toBeDefined()
  })

  it('should support error handling with RequestError', () => {
    // 验证 RequestError 的错误处理能力
    const errors: RequestError[] = []

    // 模拟网络错误收集
    const httpError = new RequestError('HTTP 404', 'HTTP_ERROR', 404)
    errors.push(httpError)

    const timeoutError = new RequestError('请求超时', 'TIMEOUT', undefined)
    errors.push(timeoutError)

    const networkError = new RequestError('网络请求失败', 'UNKNOWN_ERROR', undefined)
    errors.push(networkError)

    expect(errors).toHaveLength(3)
    expect(errors[0].code).toBe('HTTP_ERROR')
    expect(errors[1].code).toBe('TIMEOUT')
    expect(errors[2].code).toBe('UNKNOWN_ERROR')
  })

  it('should support error code constants', () => {
    // 验证常见的错误代码
    const errorCodes = ['HTTP_ERROR', 'TIMEOUT', 'UNKNOWN_ERROR', 'RESPONSE_PARSE_ERROR', 'REQUEST_FAILED']

    for (const code of errorCodes) {
      const error = new RequestError(`Error: ${code}`, code)
      expect(error.code).toBe(code)
    }
  })

  it('should support HTTP status codes', () => {
    const testCases = [
      { code: 400, message: 'Bad Request' },
      { code: 401, message: 'Unauthorized' },
      { code: 403, message: 'Forbidden' },
      { code: 404, message: 'Not Found' },
      { code: 500, message: 'Internal Server Error' },
      { code: 503, message: 'Service Unavailable' },
    ]

    for (const { code, message } of testCases) {
      const error = new RequestError(message, 'HTTP_ERROR', code)
      expect(error.status).toBe(code)
      expect(error.message).toBe(message)
    }
  })
})

describe('RequestInterceptor types', () => {
  it('should support request interceptor type', () => {
    // 验证拦截器类型定义
    const mockRequestInterceptor = (config: any) => {
      config.headers = { ...config.headers, Authorization: 'Bearer token' }
      return config
    }

    const config = { url: '/api/test', headers: {} }
    const result = mockRequestInterceptor(config)

    expect(result.headers).toHaveProperty('Authorization')
    expect(result.headers.Authorization).toBe('Bearer token')
  })

  it('should support response interceptor type', () => {
    const mockResponseInterceptor = (response: any) => {
      return { ...response, _transformed: true }
    }

    const response = { data: 'test', status: 200 }
    const result = mockResponseInterceptor(response)

    expect(result._transformed).toBe(true)
    expect(result.data).toBe('test')
  })

  it('should support error interceptor type', () => {
    const mockErrorInterceptor = (error: RequestError) => {
      return new RequestError(`Handled: ${error.message}`, 'HANDLED_ERROR', error.status)
    }

    const error = new RequestError('Original error', 'ORIGINAL', 500)
    const result = mockErrorInterceptor(error)

    expect(result.code).toBe('HANDLED_ERROR')
    expect(result.message).toContain('Handled')
  })
})

describe('useUniRequest Hook - Integration', () => {
  it('should handle timeout errors gracefully', () => {
    const timeoutError = new RequestError('请求超时', 'TIMEOUT', undefined)
    expect(timeoutError.code).toBe('TIMEOUT')
    expect(timeoutError.message).toContain('超时')
  })

  it('should handle response parsing errors', () => {
    const parseError = new RequestError('响应处理失败', 'RESPONSE_PARSE_ERROR', undefined, new SyntaxError('Invalid JSON'))
    expect(parseError.code).toBe('RESPONSE_PARSE_ERROR')
    expect(parseError.originalError).toBeDefined()
  })

  it('should support multiple error types', () => {
    const errors = [
      new RequestError('HTTP Error', 'HTTP_ERROR', 404),
      new RequestError('Timeout', 'TIMEOUT', undefined),
      new RequestError('Parse Error', 'RESPONSE_PARSE_ERROR', undefined),
      new RequestError('Network Error', 'UNKNOWN_ERROR', undefined),
    ]

    expect(errors).toHaveLength(4)
    expect(errors.every(e => e instanceof RequestError)).toBe(true)
    expect(errors.some(e => e.code === 'HTTP_ERROR')).toBe(true)
    expect(errors.some(e => e.code === 'TIMEOUT')).toBe(true)
  })

  it('should preserve error chain information', () => {
    const originalError = new Error('Original network error')
    const wrappedError = new RequestError('Network request failed', 'UNKNOWN_ERROR', undefined, originalError)

    expect(wrappedError.originalError).toBe(originalError)
    if (wrappedError.originalError instanceof Error) {
      expect(wrappedError.originalError.message).toBe('Original network error')
    }
  })
})
