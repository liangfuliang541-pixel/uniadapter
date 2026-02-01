/**
 * 高德地图平台适配器
 * 基于高德地图API实现位置服务
 */

import type { Platform } from '../types'
import type { IStorageAdapter, ICryptoAdapter, IFileAdapter, INotificationAdapter, IBiometricAdapter, IShareAdapter, IPlatformService } from './interfaces'

// 高德地图全局对象
declare const AMap: any

/**
 * 高德地图存储适配器
 */
export class AmapStorageAdapter implements IStorageAdapter {
  platform: Platform = 'amap'
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
  
  async clear(): Promise<void> {
    localStorage.clear()
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
    let used = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        used += (localStorage.getItem(key) || '').length * 2
      }
    }
    return {
      used,
      total: 5 * 1024 * 1024,
    }
  }
}

/**
 * 高德地图加密适配器
 */
export class AmapCryptoAdapter implements ICryptoAdapter {
  private encoder = new TextEncoder()
  private decoder = new TextDecoder()
  
  async encrypt(data: string, key: string): Promise<string> {
    const cryptoKey = await this.importKey(key)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      this.encoder.encode(data)
    )
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    return btoa(String.fromCharCode(...combined))
  }
  
  async decrypt(data: string, key: string): Promise<string> {
    const cryptoKey = await this.importKey(key)
    const combined = new Uint8Array(
      atob(data).split('').map(c => c.charCodeAt(0))
    )
    
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    )
    
    return this.decoder.decode(decrypted)
  }
  
  async hash(data: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      this.encoder.encode(data)
    )
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
  
  async generateKey(): Promise<string> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    const exported = await crypto.subtle.exportKey('raw', key)
    return btoa(String.fromCharCode(...new Uint8Array(exported)))
  }
  
  async deriveKey(password: string, salt: string): Promise<string> {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      baseKey,
      256
    )
    
    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)))
  }
  
  private async importKey(keyStr: string): Promise<CryptoKey> {
    const keyData = new Uint8Array(
      atob(keyStr).split('').map(c => c.charCodeAt(0))
    )
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }
}

/**
 * 高德地图文件适配器
 */
export class AmapFileAdapter implements IFileAdapter {
  async chooseImage(options: {
    count: number
    sourceType: ('album' | 'camera')[]
    maxSize?: number
  }): Promise<{ urls: string[]; files: File[] }> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = options.count > 1
      
      if (options.sourceType.includes('camera') && !options.sourceType.includes('album')) {
        input.capture = 'environment'
      }
      
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        const files = Array.from(target.files || []).slice(0, options.count)
        
        if (options.maxSize) {
          const validFiles = files.filter(f => f.size <= options.maxSize!)
          if (validFiles.length < files.length) {
            console.warn('Some files exceeded size limit')
          }
        }
        
        const urls = files.map(f => URL.createObjectURL(f))
        resolve({ urls, files })
      }
      
      input.onerror = reject
      input.click()
    })
  }
  
  async compressImage(url: string, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        const maxSize = 1920
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = url
    })
  }
  
  async saveFile(url: string, fileName: string): Promise<string> {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return fileName
  }
  
  async exportData(data: string, format: 'json' | 'csv' | 'pdf'): Promise<string> {
    const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      pdf: 'application/pdf',
    }
    
    const blob = new Blob([data], { type: mimeTypes[format] })
    const url = URL.createObjectURL(blob)
    const fileName = `amap_export_${Date.now()}.${format}`
    
    await this.saveFile(url, fileName)
    URL.revokeObjectURL(url)
    
    return fileName
  }
}

/**
 * 高德地图通知适配器
 */
export class AmapNotificationAdapter implements INotificationAdapter {
  private scheduledNotifications = new Map<string, number>()
  
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }
  
  async checkPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    return Notification.permission === 'granted'
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
    
    const timerId = window.setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(options.title, { body: options.body })
      }
      
      if (options.repeat) {
        const interval = options.repeat === 'daily' 
          ? 24 * 60 * 60 * 1000 
          : 7 * 24 * 60 * 60 * 1000
        this.scheduleLocal({ ...options, time: new Date(Date.now() + interval) })
      }
    }, delay)
    
    this.scheduledNotifications.set(options.id, timerId)
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
 * 高德地图生物识别适配器
 */
export class AmapBiometricAdapter implements IBiometricAdapter {
  async isSupported(): Promise<boolean> {
    return 'credentials' in navigator && 'PublicKeyCredential' in window
  }
  
  async getBiometricType(): Promise<'fingerprint' | 'face' | 'none'> {
    return (await this.isSupported()) ? 'fingerprint' : 'none'
  }
  
  async authenticate(_reason: string): Promise<boolean> {
    return false
  }
}

/**
 * 高德地图分享适配器
 */
export class AmapShareAdapter implements IShareAdapter {
  async share(options: {
    title: string
    text?: string
    url?: string
    image?: string
  }): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        })
        return true
      } catch {
        return false
      }
    }
    
    const text = `${options.title}\n${options.text || ''}\n${options.url || ''}`
    return this.copyToClipboard(text)
  }
  
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  }
}

/**
 * 高德地图平台服务
 */
export class AmapPlatformService implements IPlatformService {
  platform: Platform = 'amap'
  
  capabilities = {
    hasCamera: true,
    hasLocation: true,
    hasBiometric: false,
    hasNotification: true,
    hasShare: true,
    hasFileSystem: true,
    maxPhotoSize: 10 * 1024 * 1024,
    storageQuota: 5 * 1024 * 1024,
  }
  
  storage: IStorageAdapter = new AmapStorageAdapter()
  crypto: ICryptoAdapter = new AmapCryptoAdapter()
  file: IFileAdapter = new AmapFileAdapter()
  notification: INotificationAdapter = new AmapNotificationAdapter()
  biometric: IBiometricAdapter = new AmapBiometricAdapter()
  share: IShareAdapter = new AmapShareAdapter()
  
  async getSystemInfo() {
    return {
      platform: 'web',
      version: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      safeArea: {
        top: 0,
        bottom: 0,
      },
    }
  }
  
  vibrate(type: 'light' | 'medium' | 'heavy'): void {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
      }
      navigator.vibrate(patterns[type])
    }
  }
  
  async openUrl(url: string): Promise<void> {
    window.open(url, '_blank')
  }
}