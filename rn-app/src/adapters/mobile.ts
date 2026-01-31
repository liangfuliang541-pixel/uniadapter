/**
 * ============================================
 * 心迹移动版 - 平台适配器
 * ============================================
 * 
 * React Native平台特定的适配器实现
 * 复用核心业务逻辑，适配移动端API
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFS from 'react-native-fs'
import ImagePicker from 'react-native-image-picker'
import PushNotification from 'react-native-push-notification'
import EncryptedStorage from 'react-native-encrypted-storage'
import Geolocation from 'react-native-geolocation-service'

// ==================== 存储适配器 ====================
export const mobileStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('存储读取失败:', error)
      return null
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('存储写入失败:', error)
      throw error
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('存储删除失败:', error)
      throw error
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error('存储清空失败:', error)
      throw error
    }
  }
}

// ==================== 加密存储适配器 ====================
export const mobileEncryptedStorage = {
  async set(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value)
    } catch (error) {
      console.error('加密存储失败:', error)
      throw error
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key)
    } catch (error) {
      console.error('加密读取失败:', error)
      return null
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key)
    } catch (error) {
      console.error('加密删除失败:', error)
      throw error
    }
  }
}

// ==================== 文件系统适配器 ====================
export const mobileFileSystem = {
  async saveFile(fileName: string, data: string, encoding: 'utf8' | 'base64' = 'utf8'): Promise<string> {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`
      await RNFS.writeFile(filePath, data, encoding)
      return `file://${filePath}`
    } catch (error) {
      console.error('文件保存失败:', error)
      throw error
    }
  },

  async readFile(filePath: string, encoding: 'utf8' | 'base64' = 'utf8'): Promise<string> {
    try {
      return await RNFS.readFile(filePath.replace('file://', ''), encoding)
    } catch (error) {
      console.error('文件读取失败:', error)
      throw error
    }
  },

  async deleteFile(filePath: string): Promise<void> {
    try {
      await RNFS.unlink(filePath.replace('file://', ''))
    } catch (error) {
      console.error('文件删除失败:', error)
      throw error
    }
  },

  async getPhoto(options: any = {}): Promise<string | null> {
    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera(
        {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 1920,
          maxWidth: 1080,
          ...options
        },
        (response) => {
          if (response.didCancel) {
            resolve(null)
          } else if (response.error) {
            reject(new Error(response.error))
          } else {
            resolve(response.assets?.[0]?.uri || null)
          }
        }
      )
    })
  }
}

// ==================== 通知适配器 ====================
export const mobileNotifications = {
  configure(onNotification: (notification: any) => void) {
    PushNotification.configure({
      onNotification,
      requestPermissions: true,
    })
  },

  scheduleNotification(title: string, message: string, date: Date) {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      playSound: true,
      soundName: 'default',
      channelId: 'xinji-reminder'
    })
  },

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications()
  }
}

// ==================== 定位适配器 ====================
export const mobileLocation = {
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('定位失败:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      )
    })
  }
}

// ==================== 平台能力配置 ====================
export const mobilePlatformCapabilities = {
  hasCamera: true,
  hasLocation: true,
  hasBiometric: true,
  hasNotification: true,
  hasShare: true,
  hasFileSystem: true,
  maxPhotoSize: 10 * 1024 * 1024, // 10MB
  storageQuota: 100 * 1024 * 1024, // 100MB
}