import { describe, it, expect, vi } from 'vitest'
import { 
  XiaohongshuStorageAdapter,
  XiaohongshuShareAdapter,
  XiaohongshuContentAdapter
} from '../adapters/xiaohongshu'

describe('Xiaohongshu Platform Adapters', () => {
  // Mock 小红书小程序API
  beforeEach(() => {
    vi.resetModules()
    global.xhs = {
      getStorageSync: vi.fn(),
      setStorageSync: vi.fn(),
      removeStorageSync: vi.fn(),
      request: vi.fn(),
      uploadFile: vi.fn(),
      shareAppMessage: vi.fn(),
      setClipboardData: vi.fn(),
      getUserInfo: vi.fn(),
      login: vi.fn()
    }
  })

  it('should create XiaohongshuStorageAdapter', () => {
    const adapter = new XiaohongshuStorageAdapter()
    expect(adapter.platform).toBe('xiaohongshu')
  })

  it('should handle storage operations', async () => {
    const adapter = new XiaohongshuStorageAdapter()
    const testData = { content: 'test note' }
    
    global.xhs.setStorageSync.mockImplementation(() => {})
    global.xhs.getStorageSync.mockImplementation(() => JSON.stringify(testData))
    
    await adapter.set('note1', testData)
    const result = await adapter.get('note1')
    
    expect(result).toEqual(testData)
  })

  it('should create XiaohongshuShareAdapter', () => {
    const adapter = new XiaohongshuShareAdapter()
    expect(adapter).toBeDefined()
  })

  it('should share content to Xiaohongshu', async () => {
    const adapter = new XiaohongshuShareAdapter()
    global.xhs.shareAppMessage.mockImplementation((options) => {
      options.success()
    })
    
    const result = await adapter.share({
      title: '我的生活分享',
      text: '今天的美好时光',
      image: 'test.jpg'
    })
    
    expect(result).toBe(true)
  })

  it('should create XiaohongshuContentAdapter', () => {
    const adapter = new XiaohongshuContentAdapter()
    expect(adapter).toBeDefined()
  })

  it('should publish note', async () => {
    const adapter = new XiaohongshuContentAdapter()
    global.xhs.request.mockImplementation((options) => {
      options.success({ data: { noteId: '12345' } })
    })
    
    const result = await adapter.publishNote({
      title: '测试笔记',
      content: '这是测试内容',
      images: ['img1.jpg']
    })
    
    expect(result.noteId).toBe('12345')
  })

  it('should get user info', async () => {
    const adapter = new XiaohongshuContentAdapter()
    global.xhs.getUserInfo.mockImplementation((options) => {
      options.success({
        userInfo: {
          nickName: '测试用户',
          avatarUrl: 'avatar.jpg'
        }
      })
    })
    
    const userInfo = await adapter.getUserInfo()
    expect(userInfo.nickName).toBe('测试用户')
  })
})