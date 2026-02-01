# 代码模板

以下是一些常用的代码模板，可以帮助您快速创建新功能。

## 适配器模板

```typescript
/**
 * 平台适配器
 * 为[平台名称]提供统一的API接口
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
import { Platform } from '../types/platform'

declare global {
  var [平台全局变量]: any
}

export class [平台名称]StorageAdapter implements IStorageAdapter {
  platform: Platform = '[平台标识符]'
  
  async get<T>(key: string): Promise<T | null> {
    try {
      if (typeof [平台全局变量] !== 'undefined' && [平台全局变量].[存储API]) {
        const result = await [平台全局变量].[存储API].get(key)
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
    if (typeof [平台全局变量] !== 'undefined' && [平台全局变量].[存储API]) {
      await [平台全局变量].[存储API].set(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  
  // ... 其他方法实现
}

export class [平台名称]PlatformService implements IPlatformService {
  platform: Platform = '[平台标识符]'
  
  capabilities: PlatformCapabilities = {
    hasCamera: true,
    hasLocation: true,
    hasBiometric: false,
    hasNotification: true,
    hasShare: true,
    hasFileSystem: true,
    maxPhotoSize: 10 * 1024 * 1024, // 10MB
    storageQuota: 5 * 1024 * 1024, // 5MB
  }
  
  storage = new [平台名称]StorageAdapter()
  // ... 其他适配器实例
  
  async getSystemInfo(): Promise<{
    platform: string
    version: string
    screenWidth: number
    screenHeight: number
    safeArea: { top: number; bottom: number }
  }> {
    if (typeof [平台全局变量] !== 'undefined' && [平台全局变量].[系统API]) {
      return await [平台全局变量].[系统API].getInfo()
    } else {
      return {
        platform: '[平台标识符]',
        version: '1.0.0',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        safeArea: { top: 0, bottom: 0 }
      }
    }
  }
  
  // ... 其他方法实现
}
```

## Hook模板

```typescript
/**
 * 自定义Hook
 * 提供[功能描述]的跨平台实现
 */

import { useState, useEffect } from 'react'
import { usePlatform } from './usePlatform'
import { storage } from '../adapters'

export function use[功能名称]<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const platform = usePlatform()
  const [value, setValue] = useState<T>(initialValue)
  
  // 初始化值
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await storage.get<T>(key)
        if (storedValue !== null) {
          setValue(storedValue)
        }
      } catch (error) {
        console.error(`Error loading value for key "${key}":`, error)
      }
    }
    
    loadValue()
  }, [key])
  
  // 保存值
  const updateValue = async (newValue: T) => {
    try {
      setValue(newValue)
      await storage.set(key, newValue)
    } catch (error) {
      console.error(`Error saving value for key "${key}":`, error)
      // 回滚到之前的状态
      setValue(value)
    }
  }
  
  return [value, updateValue]
}
```

## 测试模板

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { [待测试的函数/类] } from '../[目标文件]'

describe('[功能名称]', () => {
  beforeEach(() => {
    // 设置测试前置条件
  })
  
  afterEach(() => {
    // 清理测试后状态
  })
  
  it('应该正确处理正常情况', async () => {
    // 测试逻辑
    const result = await [待测试函数]([参数])
    
    expect(result).toEqual([期望值])
  })
  
  it('应该正确处理异常情况', async () => {
    // 测试异常处理
    await expect([待测试函数]([异常参数])).rejects.toThrow()
  })
  
  it('应该跨平台保持一致性', async () => {
    // 测试跨平台一致性
    const webResult = await [待测试函数]([参数], 'web')
    const miniProgramResult = await [待测试函数]([参数], 'mini-program')
    
    expect(webResult).toEqual(miniProgramResult)
  })
})
```

## 文档模板

```markdown
# [功能名称]

[功能的简要描述]

## 使用方法

```typescript
import { [功能] } from 'uniadapter/[路径]'

// 示例用法
const [变量名] = [功能]([参数])
```

## API

### 参数

- `参数1`: [类型] - [描述]
- `参数2`: [类型] - [描述] (可选)

### 返回值

[返回值类型和描述]

## 平台支持

| 平台 | 支持 | 注意事项 |
|------|------|----------|
| Web/H5 | ✅ | [注意] |
| 微信小程序 | ✅ | [注意] |
| 抖音小程序 | ✅ | [注意] |

## 示例

[更多使用示例]
```

这些模板可以帮助您快速创建符合UniAdapter架构的代码。