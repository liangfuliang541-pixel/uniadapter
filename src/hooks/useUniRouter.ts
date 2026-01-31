import { platformDetection } from '../core/platform-detector'

/**
 * 统一路由Hook
 * 根据不同平台自动适配路由跳转方式
 */
export function useUniRouter() {
  const platform = platformDetection

  const navigate = (path: string, _options?: any) => {
    if (platform.isWeb) {
      // Web端使用history API
      window.history.pushState({}, '', path)
      // 触发popstate事件
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))
    } else if (platform.isMiniProgram) {
      // 小程序端使用navigateTo
      console.log('Navigate to:', path)
    } else if (platform.type === 'react-native') {
      // App端使用原生路由
      console.log('App navigation to:', path)
    }
  }

  const redirectTo = (path: string, _options?: any) => {
    if (platform.isWeb) {
      window.location.replace(path)
    } else if (platform.isMiniProgram) {
      console.log('Redirect to:', path)
    } else if (platform.type === 'react-native') {
      console.log('App redirect to:', path)
    }
  }

  const goBack = () => {
    if (platform.isWeb) {
      window.history.back()
    } else if (platform.isMiniProgram) {
      console.log('Go back in mini program')
    } else if (platform.type === 'react-native') {
      console.log('App go back')
    }
  }

  return {
    navigate,
    redirectTo,
    goBack
  }
}