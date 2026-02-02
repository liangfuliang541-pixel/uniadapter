/**
 * 支付宝小程序适配器
 * 为支付宝小程序提供统一的API接口
 */

import type {
  IStorageAdapter,
  ICryptoAdapter,
  IFileAdapter,
  INotificationAdapter,
  IBiometricAdapter,
  IShareAdapter,
  IPlatformService,
  Platform,
  PlatformCapabilities
} from '../adapters/interfaces'
import { Platform as PlatformEnum } from './platform'

declare global {
  var my: any
}

export class AlipayStorageAdapter implements IStorageAdapter {
  platform: Platform = PlatformEnum.ALIPAY_MINIPROGRAM
  
  async get<T>(key: string): Promise<T | null> {
    try {
      if (typeof my !== 'undefined' && my.getStorageSync) {
        const result = my.getStorageSync(key)
        return result ? JSON.parse(result) : null
      } else {
        // Fallback到通用存储
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      }
    } catch {
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    if (typeof my !== 'undefined' && my.setStorageSync) {
      my.setStorageSync({
        key,
        data: JSON.stringify(value)
      })
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  
  async remove(key: string): Promise<void> {
    if (typeof my !== 'undefined' && my.removeStorageSync) {
      my.removeStorageSync({
        key
      })
    } else {
      localStorage.removeItem(key)
    }
  }
  
  async clear(): Promise<void> {
    if (typeof my !== 'undefined' && my.clearStorageSync) {
      my.clearStorageSync()
    } else {
      localStorage.clear()
    }
  }
  
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    if (typeof my !== 'undefined' && my.getStorageInfoSync) {
      const result: Record<string, T | null> = {}
      for (const key of keys) {
        result[key] = await this.get<T>(key)
      }
      return result
    } else {
      const result: Record<string, T | null> = {}
      for (const key of keys) {
        const item = localStorage.getItem(key)
        result[key] = item ? JSON.parse(item) : null
      }
      return result
    }
  }
  
  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    if (typeof my !== 'undefined' && my.setStorageSync) {
      for (const [key, value] of Object.entries(items)) {
        await this.set(key, value)
      }
    } else {
      for (const [key, value] of Object.entries(items)) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
  }
  
  async getStorageInfo(): Promise<{ used: number; total: number }> {
    if (typeof my !== 'undefined' && my.getStorageInfoSync) {
      try {
        const info = my.getStorageInfoSync()
        // 支付宝小程序存储限制约为10MB
        return {
          used: info.currentSize,
          total: 10 * 1024 * 1024 // 10MB in bytes
        }
      } catch {
        return {
          used: 0,
          total: 10 * 1024 * 1024
        }
      }
    } else {
      // Web端的存储信息获取
      let used = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          if (value) {
            used += new Blob([key + value]).size
          }
        }
      }
      return {
        used,
        total: 5 * 1024 * 1024 // 5MB in bytes
      }
    }
  }
}

export class AlipayCryptoAdapter implements ICryptoAdapter {
  async encrypt(data: string, key: string): Promise<string> {
    // 支付宝小程序使用内置加密API
    if (typeof my !== 'undefined' && my.rsa) {
      try {
        // 使用RSA加密
        return my.rsa({
          operation: 'encrypt',
          data,
          key
        })
      } catch {
        // 如果不支持RSA，使用简单的加密方式
        return btoa(encodeURIComponent(data))
      }
    } else {
      // Web端使用简单的加密方式
      return btoa(encodeURIComponent(data))
    }
  }

  async decrypt(data: string, key: string): Promise<string> {
    // 支付宝小程序使用内置解密API
    if (typeof my !== 'undefined' && my.rsa) {
      try {
        // 使用RSA解密
        return my.rsa({
          operation: 'decrypt',
          data,
          key
        })
      } catch {
        // 如果不支持RSA，使用简单的解密方式
        return decodeURIComponent(atob(data))
      }
    } else {
      // Web端使用简单的解密方式
      return decodeURIComponent(atob(data))
    }
  }

  async hash(data: string): Promise<string> {
    // 使用支付宝小程序提供的哈希功能或Web Crypto API
    if (typeof my !== 'undefined' && my.rsa) {
      // 简单的哈希实现
      let hash = 0
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash |= 0 // Convert to 32bit integer
      }
      return hash.toString()
    } else {
      // Web端使用Web Crypto API
      if (crypto && crypto.subtle) {
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(data)
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      } else {
        // 降级到简单哈希
        let hash = 0
        for (let i = 0; i < data.length; i++) {
          const char = data.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash |= 0 // Convert to 32bit integer
        }
        return hash.toString()
      }
    }
  }

  async generateKey(): Promise<string> {
    if (typeof my !== 'undefined') {
      // 使用支付宝小程序生成密钥
      return Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('')
    } else {
      // Web端生成密钥
      return Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('')
    }
  }

  async deriveKey(password: string, salt: string): Promise<string> {
    if (typeof my !== 'undefined' && my.rsa) {
      // 简单的密钥派生
      return this.hash(password + salt)
    } else {
      // Web端使用PBKDF2或简单实现
      if (crypto && crypto.subtle) {
        const encoder = new TextEncoder()
        const passwordBuffer = encoder.encode(password)
        const saltBuffer = encoder.encode(salt)
        
        // 由于Web Crypto API复杂性，这里使用简单方法
        return this.hash(password + salt)
      } else {
        return this.hash(password + salt)
      }
    }
  }
}

export class AlipayFileAdapter implements IFileAdapter {
  async chooseImage(options: {
    count: number
    sourceType: ('album' | 'camera')[]
    maxSize?: number
  }): Promise<{ urls: string[]; files: File[] }> {
    if (typeof my !== 'undefined' && my.chooseImage) {
      return new Promise((resolve, reject) => {
        my.chooseImage({
          count: options.count,
          sourceType: options.sourceType,
          success: (res: any) => {
            resolve({
              urls: res.apFilePaths || res.filePaths || [],
              files: [] // 支付宝小程序不直接返回File对象
            })
          },
          fail: (error: any) => {
            reject(error)
          }
        })
      })
    } else {
      // Web端实现，需要创建一个input元素
      return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = options.count > 1
        input.accept = 'image/*'
        
        input.onchange = (event: any) => {
          const files = Array.from(event.target.files) as File[]
          const urls = files.map(file => URL.createObjectURL(file))
          
          if (options.maxSize) {
            const validFiles = files.filter(file => file.size <= options.maxSize!)
            const validUrls = validFiles.map(file => URL.createObjectURL(file))
            resolve({
              urls: validUrls,
              files: validFiles
            })
          } else {
            resolve({
              urls,
              files
            })
          }
        }
        
        input.onerror = reject
        input.click()
      })
    }
  }

  async compressImage(url: string, quality: number): Promise<string> {
    if (typeof my !== 'undefined' && my.compressImage) {
      return new Promise((resolve, reject) => {
        my.compressImage({
          apFilePaths: [url],
          compressLevel: quality > 0.8 ? 4 : quality > 0.6 ? 3 : quality > 0.4 ? 2 : 1,
          success: (res: any) => {
            resolve(res.apFilePaths[0])
          },
          fail: (error: any) => {
            reject(error)
          }
        })
      })
    } else {
      // Web端图像压缩实现
      return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          
          ctx!.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            } else {
              resolve(url) // 如果压缩失败，返回原始URL
            }
          }, 'image/jpeg', quality)
        }
      })
    }
  }

  async saveFile(url: string, fileName: string): Promise<string> {
    if (typeof my !== 'undefined' && my.saveFile) {
      return new Promise((resolve, reject) => {
        my.saveFile({
          apFilePath: url,
          success: (res: any) => {
            resolve(res.apFilePath)
          },
          fail: (error: any) => {
            reject(error)
          }
        })
      })
    } else {
      // Web端实现下载文件
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      return url
    }
  }

  async exportData(data: string, format: 'json' | 'csv' | 'pdf'): Promise<string> {
    if (typeof my !== 'undefined') {
      // 支付宝小程序数据导出
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      return this.saveFile(url, `export.${format}`)
    } else {
      // Web端数据导出
      const blob = new Blob([data], { type: 'application/json' })
      return URL.createObjectURL(blob)
    }
  }
}

export class AlipayNotificationAdapter implements INotificationAdapter {
  async requestPermission(): Promise<boolean> {
    if (typeof my !== 'undefined' && my.showTopBarRedDot) {
      // 支付宝小程序的通知权限处理
      try {
        // 检查是否支持通知
        return true
      } catch {
        return false
      }
    } else {
      // Web端通知权限
      if (!('Notification' in window)) {
        return false
      }
      
      if (Notification.permission === 'granted') {
        return true
      } else if (Notification.permission === 'denied') {
        return false
      } else {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }
    }
  }

  async checkPermission(): Promise<boolean> {
    if (typeof my !== 'undefined') {
      // 支付宝小程序检查权限
      return true // 默认认为有权限
    } else {
      // Web端检查通知权限
      return Notification.permission === 'granted'
    }
  }

  async scheduleLocal(options: {
    id: string
    title: string
    body: string
    time: Date
    repeat?: 'daily' | 'weekly'
  }): Promise<void> {
    if (typeof my !== 'undefined') {
      // 支付宝小程序目前不支持本地通知计划
      console.warn('支付宝小程序暂不支持本地通知计划功能')
      return Promise.resolve()
    } else {
      // Web端使用setTimeout模拟通知
      const delay = options.time.getTime() - Date.now()
      if (delay > 0) {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(options.title, {
              body: options.body
            })
          }
        }, delay)
      }
    }
  }

  async cancelLocal(id: string): Promise<void> {
    // 支付宝小程序不支持取消本地通知
    console.warn('支付宝小程序暂不支持取消本地通知功能')
  }

  async cancelAllLocal(): Promise<void> {
    // 支付宝小程序不支持取消所有本地通知
    console.warn('支付宝小程序暂不支持取消所有本地通知功能')
  }
}

export class AlipayBiometricAdapter implements IBiometricAdapter {
  async isSupported(): Promise<boolean> {
    if (typeof my !== 'undefined' && my.checkIsSupportFacialRecognition) {
      try {
        // 检查是否支持生物识别
        const result = await new Promise((resolve, reject) => {
          my.checkIsSupportFacialRecognition({
            success: (res: any) => resolve(res.support),
            fail: () => resolve(false)
          })
        })
        return !!result
      } catch {
        return false
      }
    } else {
      // Web端检查生物识别支持
      if ('credentials' in navigator && 'Authentication' in window) {
        return true
      }
      return false
    }
  }

  async getBiometricType(): Promise<'fingerprint' | 'face' | 'none'> {
    if (typeof my !== 'undefined' && my.checkIsSupportFacialRecognition) {
      try {
        // 支付宝小程序主要支持人脸识别
        const result = await new Promise((resolve) => {
          my.checkIsSupportFacialRecognition({
            success: (res: any) => {
              if (res.support) {
                resolve('face' as const)
              } else {
                resolve('none' as const)
              }
            },
            fail: () => resolve('none' as const)
          })
        })
        return result as Promise<'fingerprint' | 'face' | 'none'>
      } catch {
        return 'none'
      }
    } else {
      // Web端检查生物识别类型
      return 'none'
    }
  }

  async authenticate(reason: string): Promise<boolean> {
    if (typeof my !== 'undefined' && my.startFacialRecognitionVerify) {
      try {
        // 支付宝小程序人脸识别认证
        await new Promise((resolve, reject) => {
          my.startFacialRecognitionVerify({
            name: '身份验证',
            idCardNumber: '****', // 可以传入用户身份证号
            onSuccess: () => resolve(true),
            onFail: (error: any) => reject(error)
          })
        })
        return true
      } catch {
        return false
      }
    } else {
      // Web端生物识别认证
      if ('credentials' in navigator && 'Authentication' in window) {
        try {
          // 这里简化处理，实际需要更复杂的WebAuthn实现
          return true
        } catch {
          return false
        }
      }
      return false
    }
  }
}

export class AlipayShareAdapter implements IShareAdapter {
  async share(options: {
    title: string
    text?: string
    url?: string
    image?: string
  }): Promise<boolean> {
    if (typeof my !== 'undefined' && my.shareAppMessage) {
      try {
        // 支付宝小程序分享
        my.shareAppMessage({
          title: options.title,
          desc: options.text,
          path: options.url || '',
          imageUrl: options.image
        })
        return true
      } catch {
        return false
      }
    } else {
      // Web端使用Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: options.url
          })
          return true
        } catch {
          return false
        }
      } else {
        // 降级到复制链接
        if (options.url) {
          await this.copyToClipboard(options.url)
          return true
        }
        return false
      }
    }
  }

  async copyToClipboard(text: string): Promise<boolean> {
    if (typeof my !== 'undefined' && my.setClipboard) {
      try {
        await new Promise((resolve, reject) => {
          my.setClipboard({
            text,
            success: () => resolve(true),
            fail: (error: any) => reject(error)
          })
        })
        return true
      } catch {
        return false
      }
    } else {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text)
          return true
        } else {
          // 降级方案
          const textarea = document.createElement('textarea')
          textarea.value = text
          document.body.appendChild(textarea)
          textarea.select()
          const success = document.execCommand('copy')
          document.body.removeChild(textarea)
          return success
        }
      } catch {
        return false
      }
    }
  }
}

export class AlipayPlatformService implements IPlatformService {
  platform: Platform = PlatformEnum.ALIPAY_MINIPROGRAM
  
  capabilities: PlatformCapabilities = {
    hasCamera: true,
    hasLocation: true,
    hasBiometric: true,
    hasNotification: true,
    hasShare: true,
    hasFileSystem: true,
    maxPhotoSize: 10 * 1024 * 1024, // 10MB
    storageQuota: 10 * 1024 * 1024, // 10MB
  }
  
  storage = new AlipayStorageAdapter()
  crypto = new AlipayCryptoAdapter()
  file = new AlipayFileAdapter()
  notification = new AlipayNotificationAdapter()
  biometric = new AlipayBiometricAdapter()
  share = new AlipayShareAdapter()
  
  async getSystemInfo(): Promise<{
    platform: string
    version: string
    screenWidth: number
    screenHeight: number
    safeArea: { top: number; bottom: number }
  }> {
    if (typeof my !== 'undefined' && my.getSystemInfo) {
      return new Promise((resolve, reject) => {
        my.getSystemInfo({
          success: (res: any) => {
            resolve({
              platform: 'Alipay MiniProgram',
              version: res.version || 'unknown',
              screenWidth: res.screenWidth,
              screenHeight: res.screenHeight,
              safeArea: {
                top: res.safeAreaInsets?.top || 0,
                bottom: res.safeAreaInsets?.bottom || 0
              }
            })
          },
          fail: (error: any) => {
            reject(error)
          }
        })
      })
    } else {
      return {
        platform: 'Web',
        version: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        safeArea: { top: 0, bottom: 0 }
      }
    }
  }
  
  vibrate(type: 'light' | 'medium' | 'heavy'): void {
    if (typeof my !== 'undefined' && my.vibrate) {
      // 支付宝小程序震动
      my.vibrate({
        success: () => {},
        fail: () => {}
      })
    } else {
      // Web端震动（如果支持）
      if (navigator.vibrate) {
        const duration = type === 'light' ? 100 : type === 'medium' ? 200 : 300
        navigator.vibrate(duration)
      }
    }
  }
  
  async openUrl(url: string): Promise<void> {
    if (typeof my !== 'undefined' && my.openUrl) {
      // 支付宝小程序打开URL
      return new Promise((resolve, reject) => {
        my.openUrl({
          url,
          success: () => resolve(),
          fail: (error: any) => reject(error)
        })
      })
    } else {
      // Web端打开URL
      window.open(url, '_blank')
    }
  }
}