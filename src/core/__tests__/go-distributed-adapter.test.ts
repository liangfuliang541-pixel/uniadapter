import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  GoDistributedStorageAdapter,
  GoDistributedCryptoAdapter,
  GoDistributedFileAdapter,
  GoDistributedNotificationAdapter,
  GoDistributedBiometricAdapter,
  GoDistributedShareAdapter,
  GoDistributedRPCAdapter,
  GoDistributedMessageQueueAdapter,
  GoDistributedServiceDiscoveryAdapter,
  GoDistributedLockAdapter,
  GoDistributedPlatformService
} from '../adapters/go-distributed'

// 模拟Go分布式环境
const mockGoEnv = {
  storage: {
    get: vi.fn().mockResolvedValue(JSON.stringify('test-value')),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    getMultiple: vi.fn().mockResolvedValue([JSON.stringify('value1'), JSON.stringify('value2')]),
    setMultiple: vi.fn().mockResolvedValue(undefined),
    getInfo: vi.fn().mockResolvedValue({ used: 1024, total: 1024 * 1024 })
  },
  crypto: {
    encrypt: vi.fn().mockResolvedValue('encrypted-data'),
    decrypt: vi.fn().mockResolvedValue('decrypted-data'),
    hash: vi.fn().mockResolvedValue('hashed-data'),
    generateKey: vi.fn().mockResolvedValue('generated-key'),
    deriveKey: vi.fn().mockResolvedValue('derived-key')
  },
  file: {
    chooseImage: vi.fn().mockResolvedValue({ urls: ['image.jpg'], files: [] }),
    compressImage: vi.fn().mockResolvedValue('compressed-image.jpg'),
    saveFile: vi.fn().mockResolvedValue('/saved/path'),
    exportData: vi.fn().mockResolvedValue('/exported/path')
  },
  notification: {
    requestPermission: vi.fn().mockResolvedValue(true),
    checkPermission: vi.fn().mockResolvedValue(true),
    scheduleLocal: vi.fn().mockResolvedValue(undefined),
    cancelLocal: vi.fn().mockResolvedValue(undefined),
    cancelAllLocal: vi.fn().mockResolvedValue(undefined)
  },
  biometric: {
    isSupported: vi.fn().mockResolvedValue(true),
    getType: vi.fn().mockResolvedValue('fingerprint'),
    authenticate: vi.fn().mockResolvedValue(true)
  },
  share: {
    copyToClipboard: vi.fn().mockResolvedValue(true)
  },
  rpc: {
    call: vi.fn().mockResolvedValue({ result: 'success' }),
    register: vi.fn().mockResolvedValue(undefined),
    discover: vi.fn().mockResolvedValue([{ address: '127.0.0.1', port: 8080 }])
  },
  mq: {
    send: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue(undefined)
  },
  discovery: {
    register: vi.fn().mockResolvedValue(undefined),
    find: vi.fn().mockResolvedValue([{ address: '127.0.0.1', port: 8080 }]),
    heartbeat: vi.fn().mockResolvedValue(undefined),
    unregister: vi.fn().mockResolvedValue(undefined)
  },
  lock: {
    acquire: vi.fn().mockResolvedValue(true),
    release: vi.fn().mockResolvedValue(undefined)
  },
  system: {
    getInfo: vi.fn().mockResolvedValue({
      platform: 'go-distributed',
      version: '1.0.0',
      screenWidth: 1920,
      screenHeight: 1080,
      safeArea: { top: 20, bottom: 10 }
    }),
    openUrl: vi.fn().mockResolvedValue(undefined)
  }
}

describe('Go Distributed Adapters', () => {
  beforeEach(() => {
    // 设置全局Go环境模拟
    ;(globalThis as any).go = mockGoEnv
  })

  afterEach(() => {
    // 清理全局Go环境模拟
    delete (globalThis as any).go
  })

  describe('GoDistributedStorageAdapter', () => {
    it('should get value from storage', async () => {
      const adapter = new GoDistributedStorageAdapter()
      const result = await adapter.get('test-key')
      
      expect(result).toBe('test-value')
      expect(mockGoEnv.storage.get).toHaveBeenCalledWith('test-key')
    })

    it('should set value to storage', async () => {
      const adapter = new GoDistributedStorageAdapter()
      await adapter.set('test-key', 'test-value')
      
      expect(mockGoEnv.storage.set).toHaveBeenCalledWith('test-key', '"test-value"')
    })

    it('should remove value from storage', async () => {
      const adapter = new GoDistributedStorageAdapter()
      await adapter.remove('test-key')
      
      expect(mockGoEnv.storage.remove).toHaveBeenCalledWith('test-key')
    })

    it('should clear storage', async () => {
      const adapter = new GoDistributedStorageAdapter()
      await adapter.clear()
      
      expect(mockGoEnv.storage.clear).toHaveBeenCalled()
    })

    it('should get multiple values from storage', async () => {
      const adapter = new GoDistributedStorageAdapter()
      const result = await adapter.getMultiple(['key1', 'key2'])
      
      expect(result.key1).toBe('value1')
      expect(result.key2).toBe('value2')
      expect(mockGoEnv.storage.getMultiple).toHaveBeenCalledWith(['key1', 'key2'])
    })

    it('should get storage info', async () => {
      const adapter = new GoDistributedStorageAdapter()
      const result = await adapter.getStorageInfo()
      
      expect(result.used).toBe(1024)
      expect(result.total).toBe(1024 * 1024)
    })
  })

  describe('GoDistributedCryptoAdapter', () => {
    it('should encrypt data', async () => {
      const adapter = new GoDistributedCryptoAdapter()
      const result = await adapter.encrypt('plain-text', 'secret-key')
      
      expect(result).toBe('encrypted-data')
      expect(mockGoEnv.crypto.encrypt).toHaveBeenCalledWith('plain-text', 'secret-key')
    })

    it('should decrypt data', async () => {
      const adapter = new GoDistributedCryptoAdapter()
      const result = await adapter.decrypt('encrypted-data', 'secret-key')
      
      expect(result).toBe('decrypted-data')
      expect(mockGoEnv.crypto.decrypt).toHaveBeenCalledWith('encrypted-data', 'secret-key')
    })

    it('should hash data', async () => {
      const adapter = new GoDistributedCryptoAdapter()
      const result = await adapter.hash('data-to-hash')
      
      expect(result).toBe('hashed-data')
      expect(mockGoEnv.crypto.hash).toHaveBeenCalledWith('data-to-hash')
    })

    it('should generate key', async () => {
      const adapter = new GoDistributedCryptoAdapter()
      const result = await adapter.generateKey()
      
      expect(result).toBe('generated-key')
      expect(mockGoEnv.crypto.generateKey).toHaveBeenCalled()
    })

    it('should derive key', async () => {
      const adapter = new GoDistributedCryptoAdapter()
      const result = await adapter.deriveKey('password', 'salt')
      
      expect(result).toBe('derived-key')
      expect(mockGoEnv.crypto.deriveKey).toHaveBeenCalledWith('password', 'salt')
    })
  })

  describe('GoDistributedRPCAdapter', () => {
    it('should make RPC call', async () => {
      const adapter = new GoDistributedRPCAdapter()
      const result = await adapter.call('UserService', 'GetUser', { id: 1 })
      
      expect(result).toEqual({ result: 'success' })
      expect(mockGoEnv.rpc.call).toHaveBeenCalledWith('UserService', 'GetUser', { id: 1 })
    })

    it('should discover services', async () => {
      const adapter = new GoDistributedRPCAdapter()
      const result = await adapter.discover('UserService')
      
      expect(result).toEqual([{ address: '127.0.0.1', port: 8080 }])
      expect(mockGoEnv.rpc.discover).toHaveBeenCalledWith('UserService')
    })
  })

  describe('GoDistributedMessageQueueAdapter', () => {
    it('should send message to queue', async () => {
      const adapter = new GoDistributedMessageQueueAdapter()
      await adapter.sendMessage('user-events', { userId: 1, action: 'login' })
      
      expect(mockGoEnv.mq.send).toHaveBeenCalledWith('user-events', { userId: 1, action: 'login' }, undefined)
    })

    it('should subscribe to queue', async () => {
      const adapter = new GoDistributedMessageQueueAdapter()
      const handler = vi.fn()
      await adapter.subscribe('user-events', handler)
      
      expect(mockGoEnv.mq.subscribe).toHaveBeenCalledWith('user-events', handler)
    })
  })

  describe('GoDistributedServiceDiscoveryAdapter', () => {
    it('should register service', async () => {
      const adapter = new GoDistributedServiceDiscoveryAdapter()
      await adapter.registerService('UserService', '127.0.0.1', 8080, { version: '1.0.0' })
      
      expect(mockGoEnv.discovery.register).toHaveBeenCalledWith('UserService', '127.0.0.1', 8080, { version: '1.0.0' })
    })

    it('should find service', async () => {
      const adapter = new GoDistributedServiceDiscoveryAdapter()
      const result = await adapter.findService('UserService')
      
      expect(result).toEqual([{ address: '127.0.0.1', port: 8080 }])
      expect(mockGoEnv.discovery.find).toHaveBeenCalledWith('UserService')
    })
  })

  describe('GoDistributedLockAdapter', () => {
    it('should acquire distributed lock', async () => {
      const adapter = new GoDistributedLockAdapter()
      const result = await adapter.acquireLock('resource-key', 30000)
      
      expect(result).toBe(true)
      expect(mockGoEnv.lock.acquire).toHaveBeenCalledWith('resource-key', 30000)
    })

    it('should release distributed lock', async () => {
      const adapter = new GoDistributedLockAdapter()
      await adapter.releaseLock('resource-key')
      
      expect(mockGoEnv.lock.release).toHaveBeenCalledWith('resource-key')
    })
  })

  describe('GoDistributedPlatformService', () => {
    it('should initialize with all adapters', () => {
      const service = new GoDistributedPlatformService()
      
      expect(service.storage).toBeInstanceOf(GoDistributedStorageAdapter)
      expect(service.crypto).toBeInstanceOf(GoDistributedCryptoAdapter)
      expect(service.rpc).toBeInstanceOf(GoDistributedRPCAdapter)
      expect(service.mq).toBeInstanceOf(GoDistributedMessageQueueAdapter)
      expect(service.discovery).toBeInstanceOf(GoDistributedServiceDiscoveryAdapter)
      expect(service.lock).toBeInstanceOf(GoDistributedLockAdapter)
    })

    it('should get system info', async () => {
      const service = new GoDistributedPlatformService()
      const result = await service.getSystemInfo()
      
      expect(result.platform).toBe('go-distributed')
      expect(mockGoEnv.system.getInfo).toHaveBeenCalled()
    })
  })
})

// 测试fallback行为（当Go环境不可用时）
describe('Go Distributed Adapters Fallback Behavior', () => {
  beforeEach(() => {
    // 不设置全局Go环境，触发fallback逻辑
    delete (globalThis as any).go
  })

  it('should fallback to localStorage for storage operations', async () => {
    const adapter = new GoDistributedStorageAdapter()
    await adapter.set('fallback-key', 'fallback-value')
    const result = await adapter.get('fallback-key')
    
    expect(result).toBe('fallback-value')
  })

  it('should fallback to basic crypto for crypto operations', async () => {
    const adapter = new GoDistributedCryptoAdapter()
    const encrypted = await adapter.encrypt('test', 'key')
    const decrypted = await adapter.decrypt(encrypted, 'key')
    
    expect(typeof encrypted).toBe('string')
    expect(decrypted).toBeDefined()
  })

  it('should handle notification permission when Go env is unavailable', async () => {
    const adapter = new GoDistributedNotificationAdapter()
    const result = await adapter.requestPermission()
    
    expect(result).toBe(true) // 应该返回默认允许
  })
})