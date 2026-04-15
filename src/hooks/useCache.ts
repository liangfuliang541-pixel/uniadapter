/**
 * 请求缓存管理工具
 * 支持内存缓存、TTL 过期、缓存策略配置
 */

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl?: number // 毫秒
  status?: 'success' | 'error'
}

export type CacheStrategy = 'memory' | 'indexeddb' | 'hybrid'
export type CacheMode = 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only'

export interface CacheConfig {
  /** 缓存策略 */
  strategy?: CacheStrategy
  /** 缓存模式 */
  mode?: CacheMode
  /** 默认 TTL（毫秒） */
  defaultTtl?: number
  /** 最大缓存条目数 */
  maxEntries?: number
  /** 是否缓存错误响应 */
  cacheErrors?: boolean
  /** 错误响应的 TTL */
  errorTtl?: number
}

/**
 * 内存缓存实现
 */
export class RequestCache {
  private cache = new Map<string, CacheEntry>()
  private config: Required<CacheConfig>

  constructor(config: CacheConfig = {}) {
    this.config = {
      strategy: config.strategy || 'memory',
      mode: config.mode || 'cache-first',
      defaultTtl: config.defaultTtl ?? 5 * 60 * 1000, // 5 分钟
      maxEntries: config.maxEntries ?? 100,
      cacheErrors: config.cacheErrors ?? false,
      errorTtl: config.errorTtl ?? 1 * 60 * 1000, // 1 分钟
    }
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(url: string, options?: any): string {
    const method = options?.method || 'GET'
    const data = options?.data ? JSON.stringify(options.data) : ''
    return `${method}:${url}${data ? `:${data}` : ''}`
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false
    return Date.now() - entry.timestamp > entry.ttl
  }

  /**
   * 获取缓存
   */
  get<T = any>(url: string, options?: any): T | null {
    const key = this.getCacheKey(url, options)
    const entry = this.cache.get(key)

    if (!entry) return null
    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * 设置缓存
   */
  set<T = any>(url: string, data: T, options?: any, ttl?: number): void {
    // 检查缓存大小限制
    if (this.cache.size >= this.config.maxEntries) {
      // 删除最旧的条目
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    const key = this.getCacheKey(url, options)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTtl,
    })
  }

  /**
   * 缓存错误响应
   */
  setError<T = any>(url: string, error: T, options?: any): void {
    if (!this.config.cacheErrors) return

    const key = this.getCacheKey(url, options)
    this.cache.set(key, {
      data: error,
      timestamp: Date.now(),
      ttl: this.config.errorTtl,
      status: 'error',
    })
  }

  /**
   * 获取错误缓存
   */
  getError<T = any>(url: string, options?: any): T | null {
    if (!this.config.cacheErrors) return null

    const key = this.getCacheKey(url, options)
    const entry = this.cache.get(key)

    if (!entry || entry.status !== 'error') return null
    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * 删除特定缓存
   */
  remove(url: string, options?: any): void {
    const key = this.getCacheKey(url, options)
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取所有缓存键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 根据 URL 模式清空缓存
   */
  clearByPattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    const keysToDelete: string[] = []

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * 获取缓存统计
   */
  getStats(): {
    size: number
    entries: number
    hitRate: number
  } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
      hitRate: 0, // 需要在使用中计算
    }
  }
}

/**
 * 创建全局缓存实例
 */
const globalCache = new RequestCache()

export function getGlobalCache(): RequestCache {
  return globalCache
}

export function createRequestCache(config?: CacheConfig): RequestCache {
  return new RequestCache(config)
}
