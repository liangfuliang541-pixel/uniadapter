/**
 * 高级错误恢复机制
 * 提供自动重试、降级策略、错误边界等功能
 */
import React, { useCallback, useRef, useState } from 'react'
import { detectPlatform, Platform } from '../core/types/platform'

export interface RetryConfig {
  /** 最大重试次数 */
  maxAttempts?: number
  /** 重试间隔（毫秒） */
  delay?: number
  /** 指数退避倍数 */
  backoffMultiplier?: number
  /** 最大重试间隔 */
  maxDelay?: number
  /** 重试条件函数 */
  shouldRetry?: (error: any, attempt: number) => boolean
}

export interface FallbackConfig {
  /** 降级组件或函数 */
  fallback: React.ComponentType<any> | (() => React.ReactElement) | React.ReactElement
  /** 降级条件 */
  condition?: (error: any) => boolean
}

export interface ErrorRecoveryConfig {
  /** 重试配置 */
  retry?: RetryConfig
  /** 降级配置 */
  fallback?: FallbackConfig
  /** 错误处理器 */
  onError?: (error: any, context?: any) => void
  /** 恢复成功回调 */
  onRecovery?: () => void
}

/**
 * 默认重试条件：网络错误、超时、服务不可用
 */
const defaultShouldRetry = (error: any, attempt: number): boolean => {
  // 网络错误
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
    return attempt < 3
  }

  // 超时错误
  if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
    return attempt < 2
  }

  // 服务不可用 (5xx错误)
  if (error?.status >= 500 && error?.status < 600) {
    return attempt < 3
  }

  // 服务器暂时不可用
  if (error?.status === 503 || error?.status === 502) {
    return attempt < 2
  }

  return false
}

/**
 * 计算重试延迟（指数退避）
 */
const calculateDelay = (
  attempt: number,
  baseDelay: number,
  multiplier: number,
  maxDelay: number
): number => {
  const delay = baseDelay * Math.pow(multiplier, attempt - 1)
  return Math.min(delay, maxDelay)
}

/**
 * 带重试的异步操作 Hook
 */
export function useRetryableOperation<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  config: RetryConfig = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    maxDelay = 30000,
    shouldRetry = defaultShouldRetry
  } = config

  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (...args: T): Promise<R> => {
    let lastError: any

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // 创建新的 AbortController 用于取消操作
        abortControllerRef.current = new AbortController()

        setRetryCount(attempt - 1)
        setIsRetrying(attempt > 1)

        const result = await operation(...args)
        setIsRetrying(false)
        setRetryCount(0)
        return result

      } catch (error) {
        lastError = error

        // 检查是否应该重试
        if (attempt < maxAttempts && shouldRetry(error, attempt)) {
          const retryDelay = calculateDelay(attempt, delay, backoffMultiplier, maxDelay)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          continue
        }

        // 不重试或达到最大重试次数
        setIsRetrying(false)
        setRetryCount(0)
        throw error
      }
    }

    throw lastError
  }, [operation, maxAttempts, delay, backoffMultiplier, maxDelay, shouldRetry])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsRetrying(false)
      setRetryCount(0)
    }
  }, [])

  return {
    execute,
    cancel,
    isRetrying,
    retryCount,
    canRetry: retryCount < maxAttempts - 1
  }
}

/**
 * 网络状态检测和恢复 Hook
 */
export function useNetworkRecovery() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const platform = detectPlatform()

  // 检测网络状态
  const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
    try {
      // 平台特定的网络检测
      switch (platform) {
        case Platform.WEAPP:
          if (typeof wx !== 'undefined' && wx.getNetworkType) {
            return new Promise((resolve) => {
              wx.getNetworkType({
                success: (res: any) => {
                  const isConnected = res.networkType !== 'none'
                  setIsOnline(isConnected)
                  setConnectionType(res.networkType)
                  resolve(isConnected)
                },
                fail: () => resolve(false)
              })
            })
          }
          break

        case Platform.ALIPAY_MINIPROGRAM:
          if (typeof my !== 'undefined' && my.getNetworkType) {
            return new Promise((resolve) => {
              my.getNetworkType({
                success: (res: any) => {
                  const isConnected = res.networkType !== 'none'
                  setIsOnline(isConnected)
                  setConnectionType(res.networkType)
                  resolve(isConnected)
                },
                fail: () => resolve(false)
              })
            })
          }
          break

        case Platform.DOUYIN_MINIPROGRAM:
          if (typeof tt !== 'undefined' && tt.getNetworkType) {
            return new Promise((resolve) => {
              tt.getNetworkType({
                success: (res: any) => {
                  const isConnected = res.networkType !== 'none'
                  setIsOnline(isConnected)
                  setConnectionType(res.networkType)
                  resolve(isConnected)
                },
                fail: () => resolve(false)
              })
            })
          }
          break

        default:
          // Web/H5平台使用 navigator.onLine
          const online = navigator.onLine
          setIsOnline(online)
          setConnectionType(online ? 'wifi' : 'none')
          return online
      }

      // 默认认为在线
      setIsOnline(true)
      setConnectionType('unknown')
      return true
    } catch (error) {
      console.warn('Network status check failed:', error)
      return false
    }
  }, [platform])

  // 等待网络恢复
  const waitForNetworkRecovery = useCallback(async (
    timeout: number = 30000,
    checkInterval: number = 2000
  ): Promise<boolean> => {
    const startTime = Date.now()

    return new Promise((resolve) => {
      const check = async () => {
        const isConnected = await checkNetworkStatus()

        if (isConnected) {
          resolve(true)
          return
        }

        if (Date.now() - startTime >= timeout) {
          resolve(false)
          return
        }

        setTimeout(check, checkInterval)
      }

      check()
    })
  }, [checkNetworkStatus])

  return {
    isOnline,
    connectionType,
    checkNetworkStatus,
    waitForNetworkRecovery
  }
}

/**
 * 错误边界 Hook (函数式实现)
 */
export function useErrorBoundary() {
  const [error, setError] = useState<any>(null)
  const [hasError, setHasError] = useState(false)

  const resetError = useCallback(() => {
    setError(null)
    setHasError(false)
  }, [])

  const captureError = useCallback((error: any) => {
    setError(error)
    setHasError(true)
    console.error('Error captured:', error)
  }, [])

  return {
    error,
    hasError,
    resetError,
    captureError
  }
}

/**
 * 错误边界组件 (函数式实现)
 */
export function ErrorBoundary({
  children,
  fallback,
  onError
}: {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: any; retry: () => void }>
  onError?: (error: any) => void
}) {
  const { error, hasError, resetError, captureError } = useErrorBoundary()

  // 使用 useEffect 监听未捕获的错误
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      captureError(event.error)
      onError?.(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      captureError(event.reason)
      onError?.(event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [captureError, onError])

  if (hasError) {
    if (fallback) {
      const FallbackComponent = fallback
      return React.createElement(FallbackComponent, { error, retry: resetError })
    }

    return React.createElement('div', { className: 'error-boundary' },
      React.createElement('div', { className: 'error-title' }, '出错了'),
      React.createElement('div', { className: 'error-message' },
        error?.message || '发生未知错误'
      ),
      React.createElement('button', { onClick: resetError }, '重试')
    )
  }

  return React.createElement(React.Fragment, null, children)
}

/**
 * 降级组件包装器
 */
export function withFallback<P extends object>(
  Component: React.ComponentType<P>,
  fallbackConfig: FallbackConfig
) {
  return function FallbackWrapper(props: P) {
    const [hasError, setHasError] = useState(false)
    const [error, setError] = useState<any>(null)

    const handleError = useCallback((error: any) => {
      const shouldFallback = fallbackConfig.condition
        ? fallbackConfig.condition(error)
        : true

      if (shouldFallback) {
        setHasError(true)
        setError(error)
      } else {
        throw error // 不降级，重新抛出错误
      }
    }, [])

    const retry = useCallback(() => {
      setHasError(false)
      setError(null)
    }, [])

    if (hasError) {
      if (React.isValidElement(fallbackConfig.fallback)) {
        return fallbackConfig.fallback
      }

      if (typeof fallbackConfig.fallback === 'function') {
        const FallbackComponent = fallbackConfig.fallback as () => React.ReactElement
        return React.createElement(FallbackComponent)
      }

      const FallbackComponent = fallbackConfig.fallback as React.ComponentType<any>
      return React.createElement(FallbackComponent, { error, retry })
    }

    try {
      return React.createElement(Component, props)
    } catch (error) {
      handleError(error)
      return null // 这行代码不会执行，因为 handleError 会抛出错误或设置状态
    }
  }
}

/**
 * 智能错误恢复 Hook
 * 结合重试、降级、网络恢复等多种策略
 */
export function useErrorRecovery(config: ErrorRecoveryConfig = {}) {
  const { retry, fallback, onError, onRecovery } = config
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveryAttempts, setRecoveryAttempts] = useState(0)

  const { isOnline, waitForNetworkRecovery } = useNetworkRecovery()

  const recover = useCallback(async (_error: any, operation: () => Promise<any>) => {
    setIsRecovering(true)
    setRecoveryAttempts(prev => prev + 1)

    try {
      // 1. 检查网络状态
      if (!isOnline) {
        const networkRecovered = await waitForNetworkRecovery()
        if (!networkRecovered) {
          throw new Error('网络连接失败，请检查网络设置')
        }
      }

      // 2. 尝试重试 (不使用 hook，直接实现重试逻辑)
      if (retry) {
        const retryConfig = {
          maxAttempts: retry.maxAttempts || 3,
          delay: retry.delay || 1000,
          backoffMultiplier: retry.backoffMultiplier || 2,
          maxDelay: retry.maxDelay || 30000,
          shouldRetry: retry.shouldRetry || defaultShouldRetry
        }

        let lastError: any
        for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
          try {
            const result = await operation()
            setIsRecovering(false)
            onRecovery?.()
            return result
          } catch (error) {
            lastError = error
            if (attempt < retryConfig.maxAttempts && retryConfig.shouldRetry(error, attempt)) {
              const delay = calculateDelay(attempt, retryConfig.delay, retryConfig.backoffMultiplier, retryConfig.maxDelay)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            setIsRecovering(false)
            throw error
          }
        }
        throw lastError
      }

      // 3. 如果没有重试配置，直接执行
      const result = await operation()
      setIsRecovering(false)
      onRecovery?.()
      return result

    } catch (recoveryError) {
      // 4. 重试失败，使用降级策略
      if (fallback) {
        const shouldFallback = fallback.condition
          ? fallback.condition(recoveryError)
          : true

        if (shouldFallback) {
          console.warn('Using fallback due to error recovery failure:', recoveryError)
          setIsRecovering(false)
          onRecovery?.()
          // 返回降级结果的标识
          return { __fallback: true, error: recoveryError }
        }
      }

      // 5. 所有恢复策略都失败
      setIsRecovering(false)
      onError?.(recoveryError)
      throw recoveryError

    }
  }, [retry, fallback, onError, onRecovery, isOnline, waitForNetworkRecovery])

  return {
    recover,
    isRecovering,
    recoveryAttempts,
    canRecover: recoveryAttempts < (retry?.maxAttempts || 3)
  }
}