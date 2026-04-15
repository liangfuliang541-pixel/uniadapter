import { useState, useCallback, useEffect, useRef } from 'react'
import { createStorageAdapter } from '../core/adapters'
import type { IStorageAdapter } from '../core/adapters/interfaces'

interface StorageOptions {
  /** 是否持久化到 Storage（默认 false） */
  persist?: boolean
  /** Storage key（当 persist=true 时必填） */
  storageKey?: string
}

/**
 * 统一状态管理 Hook
 * 支持跨平台自动持久化，自动检测运行环境
 *
 * @example
 * // 本地状态
 * const [count, setCount] = useUniState(0)
 *
 * // 持久化状态（自动存到 Storage）
 * const [token, setToken] = useUniState('', {
 *   persist: true,
 *   storageKey: 'auth_token'
 * })
 */
export function useUniState<T>(
  initialState: T,
  options: StorageOptions = {}
): [T, (newState: T | ((prev: T) => T)) => void] {
  const { persist = false, storageKey } = options
  const storageRef = useRef<IStorageAdapter | null>(null)
  const initDone = useRef(false)

  const [state, setState] = useState<T>(initialState)

  // 仅在挂载时从 Storage 加载一次
  useEffect(() => {
    if (!persist || !storageKey || initDone.current) return
    initDone.current = true

    ;(async () => {
      try {
        if (!storageRef.current) {
          storageRef.current = await createStorageAdapter()
        }
        const stored = await storageRef.current.get<T>(storageKey)
        if (stored !== null) {
          setState(stored)
        }
      } catch {
        // ignore storage load error
      }
    })()
  }, [persist, storageKey])

  const setStateWithPersist = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setState(prev => {
        const resolved = typeof newState === 'function'
          ? (newState as (prev: T) => T)(prev)
          : newState

        // 持久化到 Storage
        if (persist && storageKey && storageRef.current) {
          storageRef.current.set(storageKey, resolved).catch(() => {
            // ignore persist error
          })
        }

        return resolved
      })
    },
    [persist, storageKey]
  )

  return [state, setStateWithPersist]
}
