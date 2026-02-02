/**
 * UniAdapter 插件系统核心
 * UniAdapter Plugin System Core
 * 
 * 提供插件注册、管理和生命周期控制功能
 * Provides plugin registration, management and lifecycle control
 */

import { PlatformType } from '../types/platform'

/**
 * 插件上下文接口
 * Plugin context interface
 */
export interface PluginContext {
  /** 当前运行平台 Current running platform */
  platform: PlatformType
  
  /** 插件配置 Plugin configuration */
  config: Record<string, any>
  
  /** 事件钩子 Event hooks */
  hooks: PluginHooks
  
  /** 注册平台适配器 Register platform adapter */
  registerAdapter: (adapter: PlatformAdapter) => void
  
  /** 注册中间件 Register middleware */
  registerMiddleware: (middleware: Middleware) => void
  
  /** 日志记录器 Logger */
  logger: PluginLogger
}

/**
 * 插件钩子接口
 * Plugin hooks interface
 */
export interface PluginHooks {
  /** 初始化钩子 Initialization hook */
  onInit: (callback: () => void) => void
  
  /** 启动钩子 Startup hook */
  onStart: (callback: () => void) => void
  
  /** 停止钩子 Shutdown hook */
  onStop: (callback: () => void) => void
  
  /** 错误处理钩子 Error handling hook */
  onError: (callback: (error: Error) => void) => void
}

/**
 * 平台适配器接口
 * Platform adapter interface
 */
export interface PlatformAdapter {
  /** 适配器名称 Adapter name */
  name: string
  
  /** 支持的平台 Supported platforms */
  platforms: PlatformType[]
  
  /** 初始化适配器 Initialize adapter */
  init: (context: PluginContext) => Promise<void>
  
  /** 销毁适配器 Destroy adapter */
  destroy: () => Promise<void>
}

/**
 * 中间件接口
 * Middleware interface
 */
export interface Middleware {
  /** 中间件名称 Middleware name */
  name: string
  
  /** 处理请求 Process request */
  handle: (request: any, next: () => Promise<any>) => Promise<any>
}

/**
 * 插件日志记录器
 * Plugin logger
 */
export interface PluginLogger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

/**
 * 插件定义接口
 * Plugin definition interface
 */
export interface Plugin {
  /** 插件名称 Plugin name (必须唯一 must be unique) */
  name: string
  
  /** 插件版本 Plugin version */
  version: string
  
  /** 插件描述 Plugin description */
  description?: string
  
  /** 依赖的其他插件 Dependencies on other plugins */
  dependencies?: string[]
  
  /** 支持的平台 Supported platforms (为空表示支持所有平台 empty means all platforms) */
  platforms?: PlatformType[]
  
  /** 插件配置架构 Plugin configuration schema */
  configSchema?: Record<string, any>
  
  /** 安装插件 Install plugin */
  install: (context: PluginContext) => Promise<void> | void
  
  /** 卸载插件 Uninstall plugin (可选 optional) */
  uninstall?: (context: PluginContext) => Promise<void> | void
  
  /** 启用插件 Enable plugin */
  enable?: (context: PluginContext) => Promise<void> | void
  
  /** 禁用插件 Disable plugin */
  disable?: (context: PluginContext) => Promise<void> | void
}

/**
 * 插件管理器类
 * Plugin manager class
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private enabledPlugins: Set<string> = new Set()
  private platformAdapters: Map<string, PlatformAdapter> = new Map()
  private middlewares: Middleware[] = []
  private context: PluginContext
  
  /**
   * 创建插件管理器
   * Create plugin manager
   * 
   * @param platform 当前平台 Current platform
   * @param config 全局配置 Global configuration
   */
  constructor(platform: PlatformType, config: Record<string, any> = {}) {
    this.context = this.createPluginContext(platform, config)
  }
  
  /**
   * 创建插件上下文
   * Create plugin context
   */
  private createPluginContext(platform: PlatformType, config: Record<string, any>): PluginContext {
    const hooks: PluginHooks = {
      onInit: (callback) => {
        // 简化实现 Simplified implementation
        callback()
      },
      onStart: (callback) => {
        callback()
      },
      onStop: (callback) => {
        callback()
      },
      onError: (callback) => {
        // 错误处理 Error handling
        window.addEventListener('error', (event) => {
          callback(new Error(event.message))
        })
      }
    }
    
    return {
      platform,
      config,
      hooks,
      registerAdapter: (adapter: PlatformAdapter) => {
        this.platformAdapters.set(adapter.name, adapter)
      },
      registerMiddleware: (middleware: Middleware) => {
        this.middlewares.push(middleware)
      },
      logger: {
        info: (message, ...args) => console.log(`[Plugin:INFO] ${message}`, ...args),
        warn: (message, ...args) => console.warn(`[Plugin:WARN] ${message}`, ...args),
        error: (message, ...args) => console.error(`[Plugin:ERROR] ${message}`, ...args),
        debug: (message, ...args) => console.debug(`[Plugin:DEBUG] ${message}`, ...args)
      }
    }
  }
  
  /**
   * 注册插件
   * Register plugin
   * 
   * @param plugin 插件定义 Plugin definition
   * @throws 如果插件已存在或依赖不满足 If plugin already exists or dependencies not satisfied
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`)
    }
    
    // 检查平台兼容性 Check platform compatibility
    if (plugin.platforms && plugin.platforms.length > 0) {
      if (!plugin.platforms.includes(this.context.platform)) {
        throw new Error(
          `Plugin '${plugin.name}' does not support platform '${this.context.platform}'. ` +
          `Supported platforms: ${plugin.platforms.join(', ')}`
        )
      }
    }
    
    // 检查依赖 Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin '${plugin.name}' requires dependency '${dep}' which is not registered`)
        }
      }
    }
    
    this.plugins.set(plugin.name, plugin)
    this.context.logger.info(`Plugin '${plugin.name}' registered`)
  }
  
  /**
   * 启用插件
   * Enable plugin
   * 
   * @param pluginName 插件名称 Plugin name
   * @returns 是否启用成功 Whether enabled successfully
   */
  async enable(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      this.context.logger.error(`Cannot enable non-existent plugin '${pluginName}'`)
      return false
    }
    
    if (this.enabledPlugins.has(pluginName)) {
      this.context.logger.warn(`Plugin '${pluginName}' is already enabled`)
      return true
    }
    
    try {
      // 安装插件 Install plugin
      await plugin.install(this.context)
      
      // 调用启用钩子（如果存在） Call enable hook if exists
      if (plugin.enable) {
        await plugin.enable(this.context)
      }
      
      this.enabledPlugins.add(pluginName)
      this.context.logger.info(`Plugin '${pluginName}' enabled`)
      return true
    } catch (error) {
      this.context.logger.error(`Failed to enable plugin '${pluginName}':`, error)
      return false
    }
  }
  
  /**
   * 禁用插件
   * Disable plugin
   * 
   * @param pluginName 插件名称 Plugin name
   * @returns 是否禁用成功 Whether disabled successfully
   */
  async disable(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      this.context.logger.error(`Cannot disable non-existent plugin '${pluginName}'`)
      return false
    }
    
    if (!this.enabledPlugins.has(pluginName)) {
      this.context.logger.warn(`Plugin '${pluginName}' is not enabled`)
      return true
    }
    
    try {
      // 调用禁用钩子（如果存在） Call disable hook if exists
      if (plugin.disable) {
        await plugin.disable(this.context)
      }
      
      // 调用卸载钩子（如果存在） Call uninstall hook if exists
      if (plugin.uninstall) {
        await plugin.uninstall(this.context)
      }
      
      this.enabledPlugins.delete(pluginName)
      this.context.logger.info(`Plugin '${pluginName}' disabled`)
      return true
    } catch (error) {
      this.context.logger.error(`Failed to disable plugin '${pluginName}':`, error)
      return false
    }
  }
  
  /**
   * 获取插件
   * Get plugin
   * 
   * @param pluginName 插件名称 Plugin name
   * @returns 插件实例或undefined Plugin instance or undefined
   */
  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName)
  }
  
  /**
   * 获取所有插件
   * Get all plugins
   * 
   * @returns 插件列表 Plugin list
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }
  
  /**
   * 获取已启用的插件
   * Get enabled plugins
   * 
   * @returns 已启用的插件列表 Enabled plugin list
   */
  getEnabledPlugins(): string[] {
    return Array.from(this.enabledPlugins)
  }
  
  /**
   * 检查插件是否启用
   * Check if plugin is enabled
   * 
   * @param pluginName 插件名称 Plugin name
   * @returns 是否启用 Whether enabled
   */
  isEnabled(pluginName: string): boolean {
    return this.enabledPlugins.has(pluginName)
  }
  
  /**
   * 应用中间件
   * Apply middlewares
   * 
   * @param request 请求 Request
   * @param handler 处理函数 Handler function
   * @returns 处理结果 Processing result
   */
  async applyMiddlewares<T>(request: any, handler: () => Promise<T>): Promise<T> {
    // 如果没有中间件，直接执行处理函数 If no middlewares, execute handler directly
    if (this.middlewares.length === 0) {
      return handler()
    }
    
    // 构建中间件链 Build middleware chain
    const chain = this.middlewares.reduceRight(
      (next, middleware) => async () => {
        try {
          return await middleware.handle(request, next)
        } catch (error) {
          this.context.logger.error(`Middleware '${middleware.name}' error:`, error)
          throw error
        }
      },
      handler
    )
    
    return chain()
  }
  
  /**
   * 获取平台适配器
   * Get platform adapter
   * 
   * @param adapterName 适配器名称 Adapter name
   * @returns 适配器实例或undefined Adapter instance or undefined
   */
  getAdapter(adapterName: string): PlatformAdapter | undefined {
    return this.platformAdapters.get(adapterName)
  }
  
  /**
   * 获取所有适配器
   * Get all adapters
   * 
   * @returns 适配器列表 Adapter list
   */
  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.platformAdapters.values())
  }
  
  /**
   * 销毁插件管理器
   * Destroy plugin manager
   */
  async destroy(): Promise<void> {
    // 禁用所有插件 Disable all plugins
    for (const pluginName of this.enabledPlugins) {
      await this.disable(pluginName)
    }
    
    // 销毁所有适配器 Destroy all adapters
    for (const adapter of this.platformAdapters.values()) {
      try {
        await adapter.destroy()
      } catch (error) {
        this.context.logger.error(`Failed to destroy adapter '${adapter.name}':`, error)
      }
    }
    
    this.plugins.clear()
    this.enabledPlugins.clear()
    this.platformAdapters.clear()
    this.middlewares = []
    
    this.context.logger.info('Plugin manager destroyed')
  }
}

/**
 * 创建插件管理器实例
 * Create plugin manager instance
 * 
 * @param platform 当前平台 Current platform
 * @param config 配置 Configuration
 * @returns 插件管理器实例 Plugin manager instance
 */
export function createPluginManager(platform: PlatformType, config?: Record<string, any>): PluginManager {
  return new PluginManager(platform, config)
}

/**
 * 导出类型和实例
 * Export types and instances
 */
export default {
  PluginManager,
  createPluginManager
}