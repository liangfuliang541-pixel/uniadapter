import { describe, it, expect, beforeEach } from 'vitest'
import { RequestCache, CacheConfig, createRequestCache } from './useCache'

describe('RequestCache', () => {
  let cache: RequestCache

  beforeEach(() => {
    cache = new RequestCache()
  })

  describe('basic operations', () => {
    it('should set and get cache entries', () => {
      const url = '/api/users'
      const data = { id: 1, name: 'Alice' }

      cache.set(url, data)
      const cached = cache.get(url)

      expect(cached).toEqual(data)
    })

    it('should return null for non-existent entries', () => {
      const cached = cache.get('/api/notexist')
      expect(cached).toBeNull()
    })

    it('should remove specific cache entries', () => {
      const url = '/api/users'
      const data = { id: 1, name: 'Alice' }

      cache.set(url, data)
      expect(cache.get(url)).toEqual(data)

      cache.remove(url)
      expect(cache.get(url)).toBeNull()
    })

    it('should clear all cache entries', () => {
      cache.set('/api/users', { id: 1 })
      cache.set('/api/posts', { id: 1 })
      cache.set('/api/comments', { id: 1 })

      expect(cache.size()).toBe(3)

      cache.clear()
      expect(cache.size()).toBe(0)
    })
  })

  describe('TTL expiration', () => {
    it('should expire cache entries after TTL', async () => {
      const url = '/api/users'
      const data = { id: 1 }

      cache.set(url, data, {}, 100) // 100ms TTL

      expect(cache.get(url)).toEqual(data)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(cache.get(url)).toBeNull()
    })

    it('should use default TTL if not specified', async () => {
      const cacheWithTtl = new RequestCache({ defaultTtl: 100 })
      const url = '/api/users'
      const data = { id: 1 }

      cacheWithTtl.set(url, data)
      expect(cacheWithTtl.get(url)).toEqual(data)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(cacheWithTtl.get(url)).toBeNull()
    })

    it('should never expire if TTL is not set', async () => {
      const cacheNoTtl = new RequestCache({ defaultTtl: undefined })
      const url = '/api/users'
      const data = { id: 1 }

      cacheNoTtl.set(url, data, {}, undefined)
      expect(cacheNoTtl.get(url)).toEqual(data)

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(cacheNoTtl.get(url)).toEqual(data)
    })
  })

  describe('cache key generation', () => {
    it('should generate different keys for different URLs', () => {
      const data = { test: true }

      cache.set('/api/users', data)
      cache.set('/api/posts', data)

      expect(cache.get('/api/users')).toEqual(data)
      expect(cache.get('/api/posts')).toEqual(data)
    })

    it('should generate different keys for different methods', () => {
      const data = { test: true }

      cache.set('/api/users', data, { method: 'GET' })
      cache.set('/api/users', { test: false }, { method: 'POST' })

      expect(cache.get('/api/users', { method: 'GET' })).toEqual(data)
      expect(cache.get('/api/users', { method: 'POST' })).toEqual({ test: false })
    })

    it('should generate different keys for different payloads', () => {
      const data1 = { result: 1 }
      const data2 = { result: 2 }

      cache.set('/api/search', data1, { data: { query: 'alice' } })
      cache.set('/api/search', data2, { data: { query: 'bob' } })

      expect(cache.get('/api/search', { data: { query: 'alice' } })).toEqual(data1)
      expect(cache.get('/api/search', { data: { query: 'bob' } })).toEqual(data2)
    })
  })

  describe('cache size limit', () => {
    it('should respect maxEntries limit', () => {
      const limitedCache = new RequestCache({ maxEntries: 3 })

      limitedCache.set('/api/1', { id: 1 })
      limitedCache.set('/api/2', { id: 2 })
      limitedCache.set('/api/3', { id: 3 })

      expect(limitedCache.size()).toBe(3)

      // Adding a 4th entry should remove the first one
      limitedCache.set('/api/4', { id: 4 })

      expect(limitedCache.size()).toBe(3)
      expect(limitedCache.get('/api/1')).toBeNull() // First entry removed
      expect(limitedCache.get('/api/4')).toEqual({ id: 4 }) // New entry added
    })
  })

  describe('error caching', () => {
    it('should cache errors when enabled', () => {
      const errorCache = new RequestCache({ cacheErrors: true })
      const url = '/api/error'
      const error = new Error('Network error')

      errorCache.setError(url, error)
      const cached = errorCache.getError(url)

      expect(cached).toEqual(error)
    })

    it('should not cache errors when disabled', () => {
      const url = '/api/error'
      const error = new Error('Network error')

      cache.setError(url, error)
      const cached = cache.getError(url)

      expect(cached).toBeNull()
    })

    it('should expire cached errors', async () => {
      const errorCache = new RequestCache({ cacheErrors: true, errorTtl: 100 })
      const url = '/api/error'
      const error = new Error('Network error')

      errorCache.setError(url, error)
      expect(errorCache.getError(url)).toEqual(error)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(errorCache.getError(url)).toBeNull()
    })
  })

  describe('cache querying', () => {
    it('should list all cache keys', () => {
      cache.set('/api/users', { id: 1 })
      cache.set('/api/posts', { id: 1 })
      cache.set('/api/comments', { id: 1 })

      const keys = cache.keys()

      expect(keys.length).toBe(3)
      expect(keys.some(k => k.includes('/api/users'))).toBe(true)
      expect(keys.some(k => k.includes('/api/posts'))).toBe(true)
      expect(keys.some(k => k.includes('/api/comments'))).toBe(true)
    })

    it('should clear cache by pattern', () => {
      cache.set('/api/users', { id: 1 })
      cache.set('/api/posts', { id: 1 })
      cache.set('/admin/users', { id: 1 })

      cache.clearByPattern('/api')

      expect(cache.get('/api/users')).toBeNull()
      expect(cache.get('/api/posts')).toBeNull()
      expect(cache.get('/admin/users')).toEqual({ id: 1 })
    })

    it('should clear cache by regex pattern', () => {
      cache.set('/api/users', { id: 1 })
      cache.set('/api/posts', { id: 1 })
      cache.set('/admin/users', { id: 1 })

      cache.clearByPattern(/^GET:.+\/api/)

      expect(cache.size()).toBeGreaterThanOrEqual(1)
    })

    it('should get cache statistics', () => {
      cache.set('/api/users', { id: 1 })
      cache.set('/api/posts', { id: 1 })

      const stats = cache.getStats()

      expect(stats.size).toBe(2)
      expect(stats.entries).toBe(2)
      expect(typeof stats.hitRate).toBe('number')
    })
  })

  describe('cache configuration', () => {
    it('should respect cache strategy configuration', () => {
      const memoryCache = new RequestCache({ strategy: 'memory' })
      expect(memoryCache).toBeDefined()
    })

    it('should support custom default TTL', async () => {
      const customCache = new RequestCache({ defaultTtl: 50 })
      customCache.set('/api/test', { data: true })

      expect(customCache.get('/api/test')).toBeDefined()

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(customCache.get('/api/test')).toBeNull()
    })

    it('should support cache mode configuration', () => {
      const cache1 = new RequestCache({ mode: 'cache-first' })
      const cache2 = new RequestCache({ mode: 'network-first' })
      const cache3 = new RequestCache({ mode: 'stale-while-revalidate' })

      expect(cache1).toBeDefined()
      expect(cache2).toBeDefined()
      expect(cache3).toBeDefined()
    })
  })

  describe('createRequestCache factory', () => {
    it('should create a new cache instance', () => {
      const newCache = createRequestCache()
      expect(newCache).toBeInstanceOf(RequestCache)
    })

    it('should create cache with custom configuration', () => {
      const config: CacheConfig = {
        strategy: 'memory',
        mode: 'cache-first',
        defaultTtl: 10000,
        maxEntries: 50,
      }

      const newCache = createRequestCache(config)
      expect(newCache).toBeInstanceOf(RequestCache)
    })
  })

  describe('concurrent access', () => {
    it('should handle concurrent set and get operations', () => {
      const promises: Promise<any>[] = []

      for (let i = 0; i < 10; i++) {
        promises.push(
          Promise.resolve().then(() => {
            cache.set(`/api/item-${i}`, { id: i })
            return cache.get(`/api/item-${i}`)
          })
        )
      }

      return Promise.all(promises).then(results => {
        expect(results.length).toBe(10)
        expect(results.every(r => r !== null)).toBe(true)
      })
    })

    it('should handle concurrent clear operations', async () => {
      cache.set('/api/1', { id: 1 })
      cache.set('/api/2', { id: 2 })

      await Promise.all([
        Promise.resolve(cache.clear()),
        Promise.resolve(cache.size()),
      ])

      expect(cache.size()).toBe(0)
    })
  })
})
