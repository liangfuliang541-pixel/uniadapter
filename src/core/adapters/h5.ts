/**
 * H5平台存储适配器
 * 基于localStorage实现
 */

import type { Platform } from '../types'
import type { IStorageAdapter } from './interfaces'

export class H5StorageAdapter implements IStorageAdapter {
  platform: Platform = 'h5'
  
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
        used += (localStorage.getItem(key) || '').length * 2 // UTF-16
      }
    }
    return {
      used,
      total: 5 * 1024 * 1024, // 5MB typical limit
    }
  }
}

/**
 * H5平台加密适配器
 * 基于Web Crypto API
 */

import type { ICryptoAdapter } from './interfaces'

export class H5CryptoAdapter implements ICryptoAdapter {
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
 * H5平台文件适配器
 */

import type { IFileAdapter } from './interfaces'

export class H5FileAdapter implements IFileAdapter {
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
        
        // 限制最大尺寸
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
    const fileName = `mood_journal_export_${Date.now()}.${format}`
    
    await this.saveFile(url, fileName)
    URL.revokeObjectURL(url)
    
    return fileName
  }
}

/**
 * H5平台通知适配器
 */

import type { INotificationAdapter } from './interfaces'

export class H5NotificationAdapter implements INotificationAdapter {
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
      // 如果时间已过，设置为明天同一时间
      delay += 24 * 60 * 60 * 1000
    }
    
    const timerId = window.setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(options.title, { body: options.body })
      }
      
      // 处理重复
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
 * H5平台生物识别适配器
 */

import type { IBiometricAdapter } from './interfaces'

export class H5BiometricAdapter implements IBiometricAdapter {
  async isSupported(): Promise<boolean> {
    return 'credentials' in navigator && 'PublicKeyCredential' in window
  }
  
  async getBiometricType(): Promise<'fingerprint' | 'face' | 'none'> {
    // H5环境下无法准确判断类型
    return (await this.isSupported()) ? 'fingerprint' : 'none'
  }
  
  async authenticate(_reason: string): Promise<boolean> {
    // H5使用WebAuthn（简化实现）
    // 实际项目中需要完整的WebAuthn流程
    return false
  }
}

/**
 * H5平台分享适配器
 */

import type { IShareAdapter } from './interfaces'

export class H5ShareAdapter implements IShareAdapter {
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
    
    // Fallback: 复制到剪贴板
    const text = `${options.title}\n${options.text || ''}\n${options.url || ''}`
    return this.copyToClipboard(text)
  }
  
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback for older browsers
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
