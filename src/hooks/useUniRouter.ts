import { useCallback } from 'react'
import { detectPlatform, Platform } from '../core/types/platform'

/**
 * 统一路由 Hook
 * 在不同平台下自动使用对应的路由 API
 *
 * @example
 * const { push, replace, goBack } = useUniRouter()
 * push('/home')
 * replace('/login')
 * goBack()
 */
export function useUniRouter() {
  const platform = detectPlatform()

  const push = useCallback((url: string) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        ;(globalThis as any).tt?.navigateTo?.({ url })
        break
      case Platform.XIAOHONGSHU:
        ;(globalThis as any).xhs?.navigateTo?.({ url })
        break
      case Platform.WEAPP:
        ;(globalThis as any).wx?.navigateTo?.({ url })
        break
      case Platform.ALIPAY_MINIPROGRAM:
        ;(globalThis as any).my?.navigateTo?.({ url })
        break
      case Platform.H5:
      default:
        if (typeof window !== 'undefined') {
          window.location.href = url
        }
    }
  }, [platform])

  const replace = useCallback((url: string) => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        ;(globalThis as any).tt?.redirectTo?.({ url })
        break
      case Platform.XIAOHONGSHU:
        ;(globalThis as any).xhs?.redirectTo?.({ url })
        break
      case Platform.WEAPP:
        ;(globalThis as any).wx?.redirectTo?.({ url })
        break
      case Platform.ALIPAY_MINIPROGRAM:
        ;(globalThis as any).my?.redirectTo?.({ url })
        break
      case Platform.H5:
      default:
        if (typeof window !== 'undefined') {
          window.location.replace(url)
        }
    }
  }, [platform])

  const goBack = useCallback(() => {
    switch (platform) {
      case Platform.DOUYIN_MINIPROGRAM:
        ;(globalThis as any).tt?.navigateBack?.()
        break
      case Platform.XIAOHONGSHU:
        ;(globalThis as any).xhs?.navigateBack?.()
        break
      case Platform.WEAPP:
        ;(globalThis as any).wx?.navigateBack?.()
        break
      case Platform.ALIPAY_MINIPROGRAM:
        ;(globalThis as any).my?.navigateBack?.()
        break
      case Platform.H5:
      default:
        if (typeof history !== 'undefined') {
          history.back()
        }
    }
  }, [platform])

  return { push, replace, goBack }
}
