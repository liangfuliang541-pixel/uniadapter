/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import {
  useRetryableOperation,
  useNetworkRecovery,
  useErrorBoundary,
  useErrorRecovery
} from './useErrorRecovery'

describe('useRetryableOperation', () => {
  it('should execute operation successfully on first attempt', async () => {
    const mockOperation = vi.fn().mockResolvedValue('success')
    const hook = renderHook(() => useRetryableOperation(mockOperation))

    const response = await hook.result.execute()
    expect(response).toBe('success')
    expect(mockOperation).toHaveBeenCalledTimes(1)
    expect(hook.result.isRetrying).toBe(false)
    expect(hook.result.retryCount).toBe(0)
  })

  it('should retry on failure according to shouldRetry logic', async () => {
    let attempts = 0
    const mockOperation = vi.fn().mockImplementation(() => {
      attempts++
      if (attempts < 3) {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve('success')
    })

    const config = {
      maxAttempts: 3,
      shouldRetry: (error: any) => error.message === 'Network error'
    }

    const hook = renderHook(() => useRetryableOperation(mockOperation, config))

    const response = await hook.result.execute()
    expect(response).toBe('success')
    expect(mockOperation).toHaveBeenCalledTimes(3)
    expect(hook.result.isRetrying).toBe(false)
  })

  it('should stop retrying after max attempts', async () => {
    const mockOperation = vi.fn().mockRejectedValue(new Error('Persistent error'))
    const hook = renderHook(() => useRetryableOperation(mockOperation, { maxAttempts: 2 }))

    await expect(hook.result.execute()).rejects.toThrow('Persistent error')
    expect(mockOperation).toHaveBeenCalledTimes(2)
  })
})

describe('useNetworkRecovery', () => {
  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    })
  })

  it('should detect online status', async () => {
    const hook = renderHook(() => useNetworkRecovery())

    const isOnline = await hook.result.checkNetworkStatus()
    expect(isOnline).toBe(true)
    expect(hook.result.isOnline).toBe(true)
  })

  it('should detect offline status', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false })
    const hook = renderHook(() => useNetworkRecovery())

    const isOnline = await hook.result.checkNetworkStatus()
    expect(isOnline).toBe(false)
    expect(hook.result.isOnline).toBe(false)
  })
})

describe('useErrorBoundary', () => {
  it('should capture and reset errors', () => {
    const hook = renderHook(() => useErrorBoundary())

    expect(hook.result.hasError).toBe(false)
    expect(hook.result.error).toBe(null)

    const testError = new Error('Test error')
    hook.result.captureError(testError)

    expect(hook.result.hasError).toBe(true)
    expect(hook.result.error).toBe(testError)

    hook.result.resetError()

    expect(hook.result.hasError).toBe(false)
    expect(hook.result.error).toBe(null)
  })
})

describe('useErrorRecovery', () => {
  it('should recover using retry strategy', async () => {
    let attempts = 0
    const operation = vi.fn().mockImplementation(() => {
      attempts++
      if (attempts < 2) {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve('success')
    })

    const hook = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 3, shouldRetry: () => true }
      })
    )

    const recoveredResult = await hook.result.recover(new Error('Initial error'), operation)

    expect(recoveredResult).toBe('success')
    expect(hook.result.isRecovering).toBe(false)
    expect(hook.result.recoveryAttempts).toBe(1)
  })

  it('should use fallback when retry fails', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Persistent error'))

    const hook = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 1 },
        fallback: { fallback: () => React.createElement('div', null, 'Fallback') }
      })
    )

    const recoveredResult = await hook.result.current.recover(new Error('Initial error'), operation)

    expect(recoveredResult).toEqual({
      __fallback: true,
      error: expect.any(Error)
    })
  })

  it('should call onError when all recovery strategies fail', async () => {
    const onError = vi.fn()
    const operation = vi.fn().mockRejectedValue(new Error('Persistent error'))

    const hook = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 1 },
        onError
      })
    )

    await expect(
      hook.result.current.recover(new Error('Initial error'), operation)
    ).rejects.toThrow('Persistent error')

    expect(onError).toHaveBeenCalled()
  })
})

// Helper function for testing hooks
function renderHook<T>(hook: () => T) {
  let result: T | undefined

  function TestComponent() {
    result = hook()
    return React.createElement('div', null)
  }

  // Simple render without testing library
  const element = React.createElement(TestComponent)
  // Force render by calling createElement
  React.createElement(React.Fragment, null, element)

  return { result: result! }
}