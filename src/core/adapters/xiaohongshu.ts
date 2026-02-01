/**
 * 小红书小程序平台适配器
 * 基于小红书开放平台API实现
 */

import type { Platform } from '../types'
import type { IStorageAdapter, ICryptoAdapter, IFileAdapter, INotificationAdapter, IBiometricAdapter, IShareAdapter, IPlatformService } from './interfaces'

// 小红书小程序全局对象
declare const xhs: any

/**
 * 小红书小程序存储适配器
 */
export class XiaohongshuStorageAdapter implements IStorageAdapter {
  platform: Platform = 'xiaohongshu'
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await xhs.getStorageSync(key)
      return result ? JSON.parse(result) : null
    } catch {
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    await xhs.setStorageSync(key, JSON.stringify(value))
  }
  
  async remove(key: string): Promise<void> {
    await xhs.removeStorageSync(key)
  }
  
  async clear(): Promise<void> {
    await xhs.clearStorageSync()
  }
  
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {}
    for (const key of keys) {
      result[key] = await this.get<T>(key)
    }
    return result
  }
  
  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    for (const [key, value] of Object.entries(items)) {
      await this.set(key, value)
    }
  }
  
  async getStorageInfo(): Promise<{ used: number; total: number }> {
    const info = await xhs.getStorageInfoSync()
    return {
      used: info.currentSize * 1024,
      total: info.limitSize * 1024,
    }
  }
}

/**
 * 小红书小程序加密适配器
 */
export class XiaohongshuCryptoAdapter implements ICryptoAdapter {
  async encrypt(data: string, key: string): Promise<string> {
    // 简单异或加密
    const keyBuffer = new TextEncoder().encode(key)
    const dataBuffer = new TextEncoder().encode(data)
    const encrypted = new Uint8Array(dataBuffer.length)
    
    for (let i = 0; i < dataBuffer.length; i++) {
      encrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length]
    }
    
    return btoa(String.fromCharCode(...encrypted))
  }
  
  async decrypt(data: string, key: string): Promise<string> {
    const keyBuffer = new TextEncoder().encode(key)
    const dataBuffer = new Uint8Array(
      atob(data).split('').map(c => c.charCodeAt(0))
    )
    const decrypted = new Uint8Array(dataBuffer.length)
    
    for (let i = 0; i < dataBuffer.length; i++) {
      decrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length]
    }
    
    return new TextDecoder().decode(decrypted)
  }
  
  async hash(data: string): Promise<string> {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }
  
  async generateKey(): Promise<string> {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }
  
  async deriveKey(password: string, salt: string): Promise<string> {
    return await this.hash(password + salt)
  }
}

/**
 * 小红书小程序文件适配器
 */
export class XiaohongshuFileAdapter implements IFileAdapter {
  async chooseImage(options: {
    count: number
    sourceType: ('album' | 'camera')[]
    maxSize?: number
  }): Promise<{ urls: string[]; files: File[] }> {
    return new Promise((resolve, reject) => {
      xhs.chooseImage({
        count: options.count,
        sourceType: options.sourceType,
        success: (res: any) => {
          resolve({
            urls: res.tempFilePaths,
            files: [],
          })
        },
        fail: reject,
      })
    })
  }
  
  async compressImage(url: string, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      xhs.compressImage({
        src: url,
        quality: quality,
        success: (res: any) => resolve(res.tempFilePath),
        fail: reject,
      })
    })
  }
  
  async saveFile(url: string, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      xhs.saveFile({
        tempFilePath: url,
        success: (res: any) => resolve(res.savedFilePath),
        fail: reject,
      })
    })
  }
  
  async exportData(data: string, format: 'json' | 'csv' | 'pdf'): Promise<string> {
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 
            format === 'csv' ? 'text/csv' : 'application/pdf' 
    })
    const url = URL.createObjectURL(blob)
    
    return new Promise((resolve, reject) => {
      xhs.saveImageToPhotosAlbum({
        filePath: url,
        success: () => resolve(`已保存到相册`),
        fail: reject,
      })
    })
  }
}

/**
 * 小红书小程序通知适配器
 */
export class XiaohongshuNotificationAdapter implements INotificationAdapter {
  private scheduledNotifications = new Map<string, number>()
  
  async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.authorize({
        scope: 'scope.notification',
        success: () => resolve(true),
        fail: () => resolve(false),
      })
    })
  }
  
  async checkPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.getSetting({
        success: (res: any) => {
          resolve(res.authSetting['scope.notification'] === true)
        },
        fail: () => resolve(false),
      })
    })
  }
  
  async scheduleLocal(options: {
    id: string
    title: string
    body: string
    time: Date
    repeat?: 'daily' | 'weekly'
  }): Promise<void> {
    const now = Date.now()
    let delay = options.time.getTime() - now
    
    if (delay < 0) {
      delay += 24 * 60 * 60 * 1000
    }
    
    const timerId = setTimeout(() => {
      xhs.showNotification({
        title: options.title,
        content: options.body,
        duration: 3000,
      })
      
      if (options.repeat) {
        const interval = options.repeat === 'daily' 
          ? 24 * 60 * 60 * 1000 
          : 7 * 24 * 60 * 60 * 1000
        this.scheduleLocal({ ...options, time: new Date(Date.now() + interval) })
      }
    }, delay)
    
    this.scheduledNotifications.set(options.id, timerId as unknown as number)
  }
  
  async cancelLocal(id: string): Promise<void> {
    const timerId = this.scheduledNotifications.get(id)
    if (timerId) {
      clearTimeout(timerId)
      this.scheduledNotifications.delete(id)
    }
  }
  
  async cancelAllLocal(): Promise<void> {
    this.scheduledNotifications.forEach(timerId => clearTimeout(timerId))
    this.scheduledNotifications.clear()
  }
}

/**
 * 小红书小程序生物识别适配器
 */
export class XiaohongshuBiometricAdapter implements IBiometricAdapter {
  async isSupported(): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.canIUse('startSoterAuthentication') && resolve(true) || resolve(false)
    })
  }
  
  async getBiometricType(): Promise<'fingerprint' | 'face' | 'none'> {
    return new Promise((resolve) => {
      xhs.startSoterAuthentication({
        requestAuthModes: ['fingerPrint', 'facial'],
        challenge: 'bio_auth',
        authContent: '请验证身份',
        success: (res: any) => {
          if (res.authMode === 'fingerPrint') {
            resolve('fingerprint')
          } else if (res.authMode === 'facial') {
            resolve('face')
          } else {
            resolve('none')
          }
        },
        fail: () => resolve('none'),
      })
    })
  }
  
  async authenticate(_reason: string): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.startSoterAuthentication({
        requestAuthModes: ['fingerPrint', 'facial'],
        challenge: 'bio_auth',
        authContent: '请验证身份',
        success: () => resolve(true),
        fail: () => resolve(false),
      })
    })
  }
}

/**
 * 小红书小程序分享适配器
 */
export class XiaohongshuShareAdapter implements IShareAdapter {
  async share(options: {
    title: string
    text?: string
    url?: string
    image?: string
  }): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.shareAppMessage({
        title: options.title,
        desc: options.text,
        path: options.url,
        imageUrl: options.image,
        success: () => resolve(true),
        fail: () => resolve(false),
      })
    })
  }
  
  async copyToClipboard(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      xhs.setClipboardData({
        data: text,
        success: () => resolve(true),
        fail: () => resolve(false),
      })
    })
  }
}

/**
 * 小红书小程序平台服务
 */
export class XiaohongshuPlatformService implements IPlatformService {
  platform: Platform = 'xiaohongshu'
  
  capabilities = {
    hasCamera: true,
    hasLocation: true,
    hasBiometric: true,
    hasNotification: true,
    hasShare: true,
    hasFileSystem: true,
    maxPhotoSize: 10 * 1024 * 1024,
    storageQuota: 10 * 1024 * 1024,
  }
  
  storage: IStorageAdapter = new XiaohongshuStorageAdapter()
  crypto: ICryptoAdapter = new XiaohongshuCryptoAdapter()
  file: IFileAdapter = new XiaohongshuFileAdapter()
  notification: INotificationAdapter = new XiaohongshuNotificationAdapter()
  biometric: IBiometricAdapter = new XiaohongshuBiometricAdapter()
  share: IShareAdapter = new XiaohongshuShareAdapter()
  
  async getSystemInfo() {
    const info = await xhs.getSystemInfo()
    return {
      platform: info.platform,
      version: info.version,
      screenWidth: info.screenWidth,
      screenHeight: info.screenHeight,
      safeArea: {
        top: info.statusBarHeight || 0,
        bottom: info.screenHeight - (info.safeArea?.bottom || info.screenHeight),
      },
    }
  }
  
  vibrate(type: 'light' | 'medium' | 'heavy'): void {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
    }
    xhs.vibrateLong({
      success: () => {},
      fail: () => {},
    })
  }
  
  async openUrl(url: string): Promise<void> {
    xhs.openUrl({ url })
  }
}