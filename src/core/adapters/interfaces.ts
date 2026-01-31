/**
 * 平台适配器接口定义
 * 支持H5、小程序、APP多端适配
 */

import type { Platform, PlatformCapabilities } from '../types'

// ==================== 存储适配器 ====================

export interface IStorageAdapter {
  platform: Platform
  
  // 基础存储
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  
  // 批量操作
  getMultiple<T>(keys: string[]): Promise<Record<string, T | null>>
  setMultiple<T>(items: Record<string, T>): Promise<void>
  
  // 存储信息
  getStorageInfo(): Promise<{ used: number; total: number }>
}

// ==================== 加密适配器 ====================

export interface ICryptoAdapter {
  // 对称加密
  encrypt(data: string, key: string): Promise<string>
  decrypt(data: string, key: string): Promise<string>
  
  // 哈希
  hash(data: string): Promise<string>
  
  // 密钥管理
  generateKey(): Promise<string>
  deriveKey(password: string, salt: string): Promise<string>
}

// ==================== 文件适配器 ====================

export interface IFileAdapter {
  // 图片选择
  chooseImage(options: {
    count: number
    sourceType: ('album' | 'camera')[]
    maxSize?: number
  }): Promise<{ urls: string[]; files: File[] }>
  
  // 图片压缩
  compressImage(url: string, quality: number): Promise<string>
  
  // 文件保存
  saveFile(url: string, fileName: string): Promise<string>
  
  // 导出
  exportData(data: string, format: 'json' | 'csv' | 'pdf'): Promise<string>
}

// ==================== 通知适配器 ====================

export interface INotificationAdapter {
  // 权限
  requestPermission(): Promise<boolean>
  checkPermission(): Promise<boolean>
  
  // 本地通知
  scheduleLocal(options: {
    id: string
    title: string
    body: string
    time: Date
    repeat?: 'daily' | 'weekly'
  }): Promise<void>
  
  cancelLocal(id: string): Promise<void>
  cancelAllLocal(): Promise<void>
}

// ==================== 生物识别适配器 ====================

export interface IBiometricAdapter {
  // 检查支持
  isSupported(): Promise<boolean>
  getBiometricType(): Promise<'fingerprint' | 'face' | 'none'>
  
  // 认证
  authenticate(reason: string): Promise<boolean>
}

// ==================== 分享适配器 ====================

export interface IShareAdapter {
  // 分享
  share(options: {
    title: string
    text?: string
    url?: string
    image?: string
  }): Promise<boolean>
  
  // 复制到剪贴板
  copyToClipboard(text: string): Promise<boolean>
}

// ==================== 平台服务 ====================

export interface IPlatformService {
  platform: Platform
  capabilities: PlatformCapabilities
  
  // 适配器实例
  storage: IStorageAdapter
  crypto: ICryptoAdapter
  file: IFileAdapter
  notification: INotificationAdapter
  biometric: IBiometricAdapter
  share: IShareAdapter
  
  // 平台方法
  getSystemInfo(): Promise<{
    platform: string
    version: string
    screenWidth: number
    screenHeight: number
    safeArea: { top: number; bottom: number }
  }>
  
  vibrate(type: 'light' | 'medium' | 'heavy'): void
  
  openUrl(url: string): Promise<void>
}

// ==================== 适配器工厂 ====================

export interface IAdapterFactory {
  createStorageAdapter(): IStorageAdapter
  createCryptoAdapter(): ICryptoAdapter
  createFileAdapter(): IFileAdapter
  createNotificationAdapter(): INotificationAdapter
  createBiometricAdapter(): IBiometricAdapter
  createShareAdapter(): IShareAdapter
  createPlatformService(): IPlatformService
}
