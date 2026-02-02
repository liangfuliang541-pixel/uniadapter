/**
 * UniAdapter 插件示例
 * UniAdapter Plugin Example
 * 
 * 演示如何创建和使用插件
 * Demonstrates how to create and use plugins
 */

import { Plugin, PlatformType } from '../src/core/types/platform'
import { createPluginManager } from '../src/core/plugin-system'

/**
 * 示例插件：增强存储插件
 * Example plugin: Enhanced storage plugin
 * 
 * 为所有平台提供加密存储功能
 * Provides encrypted storage for all platforms
 */
const EnhancedStoragePlugin: Plugin = {
  name: 'enhanced-storage',
  version: '1.0.0',
  description: '为UniAdapter提供加密存储功能 | Provides encrypted storage for UniAdapter',
  platforms: [PlatformType.H5, PlatformType.WEAPP, PlatformType.DOUYIN, PlatformType.XIAOHONGSHU],
  
  /**
   * 安装插件
   * Install plugin
   */
  async install(context) {
    context.logger.info('安装增强存储插件 | Installing enhanced storage plugin')
    
    // 注册存储适配器 Register storage adapter
    context.registerAdapter({
      name: 'encrypted-storage',
      platforms: [PlatformType.H5, PlatformType.WEAPP, PlatformType.DOUYIN, PlatformType.XIAOHONGSHU],
      
      async init() {
        context.logger.info('加密存储适配器初始化 | Encrypted storage adapter initialized')
      },
      
      async destroy() {
        context.logger.info('加密存储适配器销毁 | Encrypted storage adapter destroyed')
      }
    })
    
    // 注册中间件 Register middleware
    context.registerMiddleware({
      name: 'storage-encryption-middleware',
      
      async handle(request, next) {
        const { type, data } = request
        
        if (type === 'storage.set') {
          // 加密数据 Encrypt data
          const encryptedData = await encryptData(data.value)
          const encryptedRequest = {
            ...request,
            data: { ...data, value: encryptedData }
          }
          return next(encryptedRequest)
        }
        
        if (type === 'storage.get') {
          // 先获取数据 Get data first
          const result = await next(request)
          // 解密数据 Decrypt data
          const decryptedData = await decryptData(result)
          return decryptedData
        }
        
        return next(request)
      }
    })
    
    context.logger.info('增强存储插件安装完成 | Enhanced storage plugin installation complete')
  },
  
  /**
   * 卸载插件
   * Uninstall plugin
   */
  async uninstall(context) {
    context.logger.info('卸载增强存储插件 | Uninstalling enhanced storage plugin')
    // 清理工作 Cleanup work
  },
  
  /**
   * 启用插件
   * Enable plugin
   */
  async enable(context) {
    context.logger.info('启用增强存储插件 | Enabling enhanced storage plugin')
    // 启用逻辑 Enable logic
  },
  
  /**
   * 禁用插件
   * Disable plugin
   */
  async disable(context) {
    context.logger.info('禁用增强存储插件 | Disabling enhanced storage plugin')
    // 禁用逻辑 Disable logic
  }
}

/**
 * 示例插件：分析插件
 * Example plugin: Analytics plugin
 * 
 * 提供跨平台数据分析功能
 * Provides cross-platform analytics functionality
 */
const AnalyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  description: '跨平台数据分析插件 | Cross-platform analytics plugin',
  dependencies: ['enhanced-storage'], // 依赖增强存储插件 Depends on enhanced storage plugin
  
  async install(context) {
    context.logger.info('安装分析插件 | Installing analytics plugin')
    
    // 根据不同平台注册不同的分析适配器 Register different analytics adapters based on platform
    if (context.platform === PlatformType.H5) {
      context.registerAdapter({
        name: 'google-analytics',
        platforms: [PlatformType.H5],
        
        async init() {
          context.logger.info('Google Analytics适配器初始化 | Google Analytics adapter initialized')
          // 初始化Google Analytics Initialize Google Analytics
          if (typeof window !== 'undefined') {
            // 这里应该是实际的Google Analytics初始化代码
            // This should be actual Google Analytics initialization code
            console.log('Google Analytics initialized for H5')
          }
        },
        
        async destroy() {
          context.logger.info('Google Analytics适配器销毁 | Google Analytics adapter destroyed')
        }
      })
    } else if (context.platform === PlatformType.WEAPP) {
      context.registerAdapter({
        name: 'weapp-analytics',
        platforms: [PlatformType.WEAPP],
        
        async init() {
          context.logger.info('微信小程序分析适配器初始化 | WeChat Mini Program analytics adapter initialized')
          // 初始化微信小程序分析 Initialize WeChat Mini Program analytics
          if (typeof wx !== 'undefined') {
            console.log('WeChat analytics initialized')
          }
        },
        
        async destroy() {
          context.logger.info('微信小程序分析适配器销毁 | WeChat Mini Program analytics adapter destroyed')
        }
      })
    }
    
    // 注册分析中间件 Register analytics middleware
    context.registerMiddleware({
      name: 'analytics-middleware',
      
      async handle(request, next) {
        const startTime = Date.now()
        
        try {
          const result = await next(request)
          const duration = Date.now() - startTime
          
          // 记录成功分析 Record success analytics
          recordAnalyticsEvent({
            event: 'request_success',
            duration,
            requestType: request.type,
            platform: context.platform
          })
          
          return result
        } catch (error) {
          // 记录错误分析 Record error analytics
          recordAnalyticsEvent({
            event: 'request_error',
            duration: Date.now() - startTime,
            requestType: request.type,
            platform: context.platform,
            error: error.message
          })
          
          throw error
        }
      }
    })
    
    context.logger.info('分析插件安装完成 | Analytics plugin installation complete')
  }
}

/**
 * 示例插件：UI组件插件
 * Example plugin: UI components plugin
 * 
 * 提供跨平台UI组件
 * Provides cross-platform UI components
 */
const UIComponentsPlugin: Plugin = {
  name: 'ui-components',
  version: '1.0.0',
  description: '跨平台UI组件库 | Cross-platform UI component library',
  
  async install(context) {
    context.logger.info('安装UI组件插件 | Installing UI components plugin')
    
    // 注册UI适配器 Register UI adapter
    context.registerAdapter({
      name: 'unified-ui',
      platforms: [PlatformType.H5, PlatformType.WEAPP, PlatformType.DOUYIN, PlatformType.XIAOHONGSHU],
      
      async init() {
        context.logger.info('统一UI适配器初始化 | Unified UI adapter initialized')
        // 加载UI组件 Load UI components
        loadUIComponents()
      },
      
      async destroy() {
        context.logger.info('统一UI适配器销毁 | Unified UI adapter destroyed')
        // 清理UI组件 Cleanup UI components
      }
    })
    
    context.logger.info('UI组件插件安装完成 | UI components plugin installation complete')
  }
}

/**
 * 演示如何使用插件系统
 * Demonstrate how to use the plugin system
 */
export async function demonstratePluginSystem() {
  console.log('=== UniAdapter 插件系统演示 ===')
  console.log('=== UniAdapter Plugin System Demonstration ===')
  
  // 创建插件管理器 Create plugin manager
  const pluginManager = createPluginManager(PlatformType.H5, {
    analytics: { enabled: true, trackingId: 'UA-123456789' },
    storage: { encryptionKey: 'my-secret-key' }
  })
  
  try {
    // 注册插件 Register plugins
    pluginManager.register(EnhancedStoragePlugin)
    pluginManager.register(AnalyticsPlugin)
    pluginManager.register(UIComponentsPlugin)
    
    console.log('注册的插件:', pluginManager.getAllPlugins().map(p => p.name))
    console.log('Registered plugins:', pluginManager.getAllPlugins().map(p => p.name))
    
    // 启用插件 Enable plugins
    await pluginManager.enable('enhanced-storage')
    await pluginManager.enable('analytics')
    await pluginManager.enable('ui-components')
    
    console.log('已启用的插件:', pluginManager.getEnabledPlugins())
    console.log('Enabled plugins:', pluginManager.getEnabledPlugins())
    
    // 演示中间件使用 Demonstrate middleware usage
    const request = { type: 'storage.set', data: { key: 'user', value: 'secret-data' } }
    
    const result = await pluginManager.applyMiddlewares(request, async () => {
      console.log('处理请求:', request)
      console.log('Processing request:', request)
      return { success: true, data: 'processed' }
    })
    
    console.log('中间件处理结果:', result)
    console.log('Middleware processing result:', result)
    
    // 获取适配器 Get adapters
    const adapters = pluginManager.getAllAdapters()
    console.log('注册的适配器:', adapters.map(a => a.name))
    console.log('Registered adapters:', adapters.map(a => a.name))
    
    // 禁用插件 Disable plugins
    await pluginManager.disable('analytics')
    
    console.log('禁用后启用的插件:', pluginManager.getEnabledPlugins())
    console.log('Enabled plugins after disable:', pluginManager.getEnabledPlugins())
    
    // 销毁插件管理器 Destroy plugin manager
    await pluginManager.destroy()
    
    console.log('插件系统演示完成')
    console.log('Plugin system demonstration complete')
    
  } catch (error) {
    console.error('插件系统演示错误:', error)
    console.error('Plugin system demonstration error:', error)
  }
}

// 辅助函数 Helper functions

/**
 * 加密数据
 * Encrypt data
 */
async function encryptData(data: any): Promise<string> {
  // 简化实现 - 实际应用中应该使用强加密算法
  // Simplified implementation - should use strong encryption in production
  return btoa(JSON.stringify(data))
}

/**
 * 解密数据
 * Decrypt data
 */
async function decryptData(encryptedData: string): Promise<any> {
  // 简化实现 Simplified implementation
  return JSON.parse(atob(encryptedData))
}

/**
 * 记录分析事件
 * Record analytics event
 */
function recordAnalyticsEvent(event: any): void {
  console.log('[Analytics]', event)
  // 实际应用中应该发送到分析服务器
  // In production, should send to analytics server
}

/**
 * 加载UI组件
 * Load UI components
 */
function loadUIComponents(): void {
  console.log('加载UI组件...')
  console.log('Loading UI components...')
  // 实际应用中应该加载实际的UI组件
  // In production, should load actual UI components
}

// 导出插件供其他模块使用 Export plugins for other modules to use
export {
  EnhancedStoragePlugin,
  AnalyticsPlugin,
  UIComponentsPlugin
}