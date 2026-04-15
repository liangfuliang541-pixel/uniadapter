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
import { renderHook, act } from '@testing-library/react'

describe('useRetryableOperation', () => {
  it('should execute operation successfully on first attempt', async () => {
    const mockOperation = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useRetryableOperation(mockOperation))

    const response = await result.current.execute()
    expect(response).toBe('success')
    expect(mockOperation).toHaveBeenCalledTimes(1)
    expect(result.current.isRetrying).toBe(false)
    expect(result.current.retryCount).toBe(0)
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

    const { result } = renderHook(() => useRetryableOperation(mockOperation, config))

    const response = await result.current.execute()
    expect(response).toBe('success')
    expect(mockOperation).toHaveBeenCalledTimes(3)
    // Wait for state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(result.current.isRetrying).toBe(false)
  })

  it('should stop retrying after max attempts', async () => {
    const mockOperation = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useRetryableOperation(mockOperation, {
      maxAttempts: 2,
      shouldRetry: () => true // Always retry for this test
    }))

    await expect(result.current.execute()).rejects.toThrow('Network error')
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
    const { result } = renderHook(() => useNetworkRecovery())

    const isOnline = await result.current.checkNetworkStatus()
    expect(isOnline).toBe(true)
    expect(result.current.isOnline).toBe(true)
  })

  it('should detect offline status', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false })
    const { result } = renderHook(() => useNetworkRecovery())

    const isOnline = await result.current.checkNetworkStatus()
    expect(isOnline).toBe(false)
    // Wait for state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(result.current.isOnline).toBe(false)
  })
})

describe('useErrorBoundary', () => {
  it('should capture and reset errors', async () => {
    const { result } = renderHook(() => useErrorBoundary())

    expect(result.current.hasError).toBe(false)
    expect(result.current.error).toBe(null)

    const testError = new Error('Test error')
    act(() => {
      result.current.captureError(testError)
    })

    expect(result.current.hasError).toBe(true)
    expect(result.current.error).toBe(testError)

    act(() => {
      result.current.resetError()
    })

    expect(result.current.hasError).toBe(false)
    expect(result.current.error).toBe(null)
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

    const { result } = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 3, shouldRetry: () => true }
      })
    )

    const recoveredResult = await result.current.recover(new Error('Initial error'), operation)

    expect(recoveredResult).toBe('success')
    // Wait for state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(result.current.isRecovering).toBe(false)
    expect(result.current.recoveryAttempts).toBe(1)
  })

  it('should use fallback when retry fails', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Persistent error'))

    const { result } = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 1 },
        fallback: { fallback: () => React.createElement('div', null, 'Fallback') }
      })
    )

    const recoveredResult = await result.current.recover(new Error('Initial error'), operation)

    expect(recoveredResult).toEqual({
      __fallback: true,
      error: expect.any(Error)
    })
  })

  it('should call onError when all recovery strategies fail', async () => {
    const onError = vi.fn()
    const operation = vi.fn().mockRejectedValue(new Error('Persistent error'))

    const { result } = renderHook(() =>
      useErrorRecovery({
        retry: { maxAttempts: 1 },
        onError
      })
    )

    await expect(
      result.current.recover(new Error('Initial error'), operation)
    ).rejects.toThrow('Persistent error')

    expect(onError).toHaveBeenCalled()
  })
})