import { describe, it, expect, vi } from 'vitest'
import { 
  DouyinStorageAdapter, 
  DouyinCryptoAdapter,
  DouyinFileAdapter,
  DouyinNotificationAdapter,
  DouyinBiometricAdapter,
  DouyinShareAdapter
} from '../adapters/douyin'

describe('Douyin Platform Adapters', () => {
  // Mock 抖音小程序API
  beforeEach(() => {
    vi.resetModules()
    global.tt = {
      getStorageSync: vi.fn(),
      setStorageSync: vi.fn(),
      removeStorageSync: vi.fn(),
      clearStorageSync: vi.fn(),
      getStorageInfoSync: vi.fn(() => ({ currentSize: 100, limitSize: 10240 })),
      chooseImage: vi.fn(),
      compressImage: vi.fn(),
      saveFile: vi.fn(),
      saveImageToPhotosAlbum: vi.fn(),
      authorize: vi.fn(),
      getSetting: vi.fn(),
      showNotification: vi.fn(),
      startSoterAuthentication: vi.fn(),
      shareAppMessage: vi.fn(),
      setClipboardData: vi.fn(),
      getSystemInfo: vi.fn(() => ({
        platform: 'ios',
        version: '1.0.0',
        screenWidth: 375,
        screenHeight: 667,
        statusBarHeight: 20,
        safeArea: { bottom: 647 }
      })),
      vibrateLong: vi.fn(),
      openUrl: vi.fn()
    }
  })

  it('should create DouyinStorageAdapter', () => {
    const adapter = new DouyinStorageAdapter()
    expect(adapter.platform).toBe('douyin')
  })

  it('should set and get storage data', async () => {
    const adapter = new DouyinStorageAdapter()
    const testData = { name: 'test', value: 123 }
    
    global.tt.setStorageSync.mockImplementation(() => {})
    global.tt.getStorageSync.mockImplementation(() => JSON.stringify(testData))
    
    await adapter.set('testKey', testData)
    const result = await adapter.get('testKey')
    
    expect(result).toEqual(testData)
  })

  it('should create DouyinCryptoAdapter', () => {
    const adapter = new DouyinCryptoAdapter()
    expect(adapter).toBeDefined()
  })

  it('should encrypt and decrypt data', async () => {
    const adapter = new DouyinCryptoAdapter()
    const originalData = 'Hello World'
    const key = 'test-key-12345'
    
    const encrypted = await adapter.encrypt(originalData, key)
    const decrypted = await adapter.decrypt(encrypted, key)
    
    expect(decrypted).toBe(originalData)
  })

  it('should create DouyinFileAdapter', () => {
    const adapter = new DouyinFileAdapter()
    expect(adapter).toBeDefined()
  })

  it('should choose image', async () => {
    const adapter = new DouyinFileAdapter()
    const mockResult = { tempFilePaths: ['path1.jpg', 'path2.jpg'] }
    
    global.tt.chooseImage.mockImplementation((options) => {
      options.success(mockResult)
    })
    
    const result = await adapter.chooseImage({
      count: 2,
      sourceType: ['album']
    })
    
    expect(result.urls).toEqual(mockResult.tempFilePaths)
  })

  it('should create DouyinNotificationAdapter', () => {
    const adapter = new DouyinNotificationAdapter()
    expect(adapter).toBeDefined()
  })

  it('should request notification permission', async () => {
    const adapter = new DouyinNotificationAdapter()
    global.tt.authorize.mockImplementation((options) => {
      options.success()
    })
    
    const result = await adapter.requestPermission()
    expect(result).toBe(true)
  })

  it('should create DouyinBiometricAdapter', () => {
    const adapter = new DouyinBiometricAdapter()
    expect(adapter).toBeDefined()
  })

  it('should check biometric support', async () => {
    const adapter = new DouyinBiometricAdapter()
    global.tt.startSoterAuthentication.mockImplementation((options) => {
      options.success({ authMode: 'fingerPrint' })
    })
    
    const result = await adapter.getBiometricType()
    expect(result).toBe('fingerprint')
  })

  it('should create DouyinShareAdapter', () => {
    const adapter = new DouyinShareAdapter()
    expect(adapter).toBeDefined()
  })

  it('should share content', async () => {
    const adapter = new DouyinShareAdapter()
    global.tt.shareAppMessage.mockImplementation((options) => {
      options.success()
    })
    
    const result = await adapter.share({
      title: 'Test Share',
      text: 'Test content'
    })
    
    expect(result).toBe(true)
  })
})