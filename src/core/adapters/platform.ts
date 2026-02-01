/**
 * 平台服务实现
 */

import { Platform, PlatformCapabilities } from '../types/platform'
import type { 
  IPlatformService, 
  IStorageAdapter, 
  ICryptoAdapter, 
  IFileAdapter,
  INotificationAdapter,
  IBiometricAdapter,
  IShareAdapter 
} from './interfaces'
import {
  H5StorageAdapter,
  H5CryptoAdapter,
  H5FileAdapter,
  H5NotificationAdapter,
  H5BiometricAdapter,
  H5ShareAdapter,
} from './h5'

class H5PlatformService implements IPlatformService {
  platform: Platform = Platform.H5
  
  capabilities: PlatformCapabilities = {
    hasCamera: true,
    hasLocation: 'geolocation' in navigator,
    hasBiometric: 'credentials' in navigator,
    hasNotification: 'Notification' in window,
    hasShare: 'share' in navigator,
    hasFileSystem: true,
    maxPhotoSize: 10 * 1024 * 1024,
    storageQuota: 5 * 1024 * 1024,
  }
  
  storage: IStorageAdapter
  crypto: ICryptoAdapter
  file: IFileAdapter
  notification: INotificationAdapter
  biometric: IBiometricAdapter
  share: IShareAdapter
  
  constructor() {
    this.storage = new H5StorageAdapter()
    this.crypto = new H5CryptoAdapter()
    this.file = new H5FileAdapter()
    this.notification = new H5NotificationAdapter()
    this.biometric = new H5BiometricAdapter()
    this.share = new H5ShareAdapter()
  }
  
  async getSystemInfo() {
    return {
      platform: navigator.platform,
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

// 单例实例
let platformService: IPlatformService | null = null

export function getPlatformService(): IPlatformService {
  if (!platformService) {
    // 根据环境检测平台
    // 目前仅实现H5，后续可扩展小程序和APP
    platformService = new H5PlatformService()
  }
  return platformService
}

// 导出便捷方法
export const storage = () => getPlatformService().storage
export const crypto = () => getPlatformService().crypto
export const file = () => getPlatformService().file
export const notification = () => getPlatformService().notification
export const biometric = () => getPlatformService().biometric
export const share = () => getPlatformService().share