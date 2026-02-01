# Go分布式系统集成指南

## 概述

UniAdapter 不仅支持前端多平台适配，还提供了对 Go 语言分布式系统的支持。通过统一的 API 接口，开发者可以在前端和后端之间实现无缝的数据交互和功能调用。

## 核心功能

### 1. 微服务架构支持

UniAdapter 的 Go 集成支持完整的微服务架构，包括服务注册与发现、负载均衡、熔断器等特性。

```typescript
import { microservice } from 'uniadapter/go'

// 服务注册
await microservice.register('UserService', {
  host: 'localhost',
  port: 8080,
  metadata: {
    version: '1.0.0',
    region: 'us-east-1'
  }
})

// 服务发现
const userService = await microservice.discovery.find('UserService')
```

### 2. RPC 远程过程调用

通过统一的 RPC 接口，前端可以直接调用后端微服务的方法。

```typescript
import { microservice } from 'uniadapter/go'

// 调用远程服务
try {
  const result = await microservice.rpc('UserService.GetUser', {
    userId: '12345'
  })
  
  console.log('用户信息:', result)
} catch (error) {
  console.error('RPC 调用失败:', error)
}
```

### 3. 消息队列与事件驱动

支持发布/订阅模式的消息队列，实现异步通信和事件驱动架构。

```typescript
import { microservice } from 'uniadapter/go'

// 订阅事件
microservice.queue.subscribe('user.events.created', async (data) => {
  console.log('收到用户创建事件:', data)
  // 处理业务逻辑
})

// 发布事件
await microservice.queue.publish('user.events.created', {
  userId: '12345',
  username: 'john_doe',
  timestamp: Date.now()
})
```

### 4. 分布式锁与协调

提供分布式锁机制，确保跨服务的并发安全。

```typescript
import { microservice } from 'uniadapter/go'

async function updateSharedResource(resourceId, newData) {
  const lockKey = `resource_${resourceId}`
  
  // 尝试获取分布式锁
  const lock = await microservice.lock.acquire(lockKey, 10000) // 10秒超时
  
  if (!lock) {
    throw new Error('无法获取分布式锁')
  }
  
  try {
    // 执行临界区操作
    await performUpdate(resourceId, newData)
  } finally {
    // 释放锁
    await microservice.lock.release(lockKey)
  }
}
```

## 配置选项

### 连接配置

```typescript
import { configureMicroservice } from 'uniadapter/go'

configureMicroservice({
  // 服务发现配置
  discovery: {
    consul: {
      host: 'localhost',
      port: 8500,
      secure: false
    }
  },
  
  // RPC 配置
  rpc: {
    timeout: 5000, // 5秒超时
    retries: 3,    // 重试次数
    loadBalance: 'round-robin' // 负载均衡策略
  },
  
  // 消息队列配置
  queue: {
    redis: {
      host: 'localhost',
      port: 6379
    },
    rabbitmq: {
      url: 'amqp://localhost:5672'
    }
  },
  
  // 分布式锁配置
  lock: {
    redis: {
      host: 'localhost',
      port: 6379,
      timeout: 30000 // 锁超时时间
    }
  }
})
```

## 实际应用场景

### 1. 用户管理系统

```typescript
import { microservice } from 'uniadapter/go'

class UserService {
  // 获取用户信息
  static async getUser(userId: string) {
    return await microservice.rpc('UserService.GetUser', { userId })
  }
  
  // 创建用户
  static async createUser(userData: any) {
    const result = await microservice.rpc('UserService.CreateUser', userData)
    
    // 发布用户创建事件
    await microservice.queue.publish('user.events.created', {
      userId: result.userId,
      ...userData
    })
    
    return result
  }
  
  // 更新用户信息
  static async updateUser(userId: string, updateData: any) {
    const lockKey = `user_${userId}`
    const lock = await microservice.lock.acquire(lockKey, 10000)
    
    if (!lock) {
      throw new Error('无法获取用户更新锁')
    }
    
    try {
      const result = await microservice.rpc('UserService.UpdateUser', {
        userId,
        updateData
      })
      
      // 发布用户更新事件
      await microservice.queue.publish('user.events.updated', {
        userId,
        updateData
      })
      
      return result
    } finally {
      await microservice.lock.release(lockKey)
    }
  }
}
```

### 2. 订单处理系统

```typescript
import { microservice } from 'uniadapter/go'

class OrderService {
  // 创建订单
  static async createOrder(orderData: any) {
    // 获取分布式锁防止重复下单
    const lockKey = `order_creation_${orderData.userId}`
    const lock = await microservice.lock.acquire(lockKey, 5000)
    
    if (!lock) {
      throw new Error('正在处理您的订单，请稍后再试')
    }
    
    try {
      // 检查库存
      const inventoryCheck = await microservice.rpc('InventoryService.CheckStock', {
        items: orderData.items
      })
      
      if (!inventoryCheck.available) {
        throw new Error('库存不足')
      }
      
      // 创建订单
      const orderResult = await microservice.rpc('OrderService.CreateOrder', orderData)
      
      // 异步扣减库存
      await microservice.queue.publish('inventory.events.reserve', {
        orderId: orderResult.orderId,
        items: orderData.items
      })
      
      // 异步发送通知
      await microservice.queue.publish('notification.events.order-created', {
        orderId: orderResult.orderId,
        userId: orderData.userId
      })
      
      return orderResult
    } finally {
      await microservice.lock.release(lockKey)
    }
  }
  
  // 订单状态更新
  static async updateOrderStatus(orderId: string, newStatus: string) {
    const result = await microservice.rpc('OrderService.UpdateStatus', {
      orderId,
      newStatus
    })
    
    // 发布订单状态变更事件
    await microservice.queue.publish('order.events.status-changed', {
      orderId,
      newStatus,
      timestamp: Date.now()
    })
    
    return result
  }
}
```

### 3. 缓存管理

```typescript
import { microservice } from 'uniadapter/go'

class CacheService {
  // 获取缓存
  static async getCache(key: string) {
    return await microservice.rpc('CacheService.Get', { key })
  }
  
  // 设置缓存
  static async setCache(key: string, value: any, ttl?: number) {
    return await microservice.rpc('CacheService.Set', {
      key,
      value,
      ttl
    })
  }
  
  // 删除缓存
  static async deleteCache(key: string) {
    return await microservice.rpc('CacheService.Delete', { key })
  }
  
  // 批量删除缓存
  static async deleteCachePattern(pattern: string) {
    return await microservice.rpc('CacheService.DeletePattern', { pattern })
  }
}
```

## 错误处理

### RPC 错误处理

```typescript
import { microservice } from 'uniadapter/go'

async function safeRpcCall(serviceMethod: string, requestData: any) {
  try {
    const result = await microservice.rpc(serviceMethod, requestData)
    return { success: true, data: result }
  } catch (error) {
    console.error(`RPC 调用失败 ${serviceMethod}:`, error)
    
    // 根据错误类型进行处理
    if (error.code === 'SERVICE_UNAVAILABLE') {
      // 服务不可用，尝试降级方案
      return { success: false, error: '服务暂时不可用，请稍后重试' }
    } else if (error.code === 'TIMEOUT') {
      // 超时错误
      return { success: false, error: '请求超时，请稍后重试' }
    } else {
      // 其他错误
      return { success: false, error: '请求失败，请稍后重试' }
    }
  }
}
```

### 消息队列错误处理

```typescript
import { microservice } from 'uniadapter/go'

// 带重试的消息发布
async function publishWithRetry(topic: string, data: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await microservice.queue.publish(topic, data)
      return true
    } catch (error) {
      console.error(`消息发布失败 (尝试 ${i + 1}/${maxRetries}):`, error)
      
      if (i === maxRetries - 1) {
        // 最后一次尝试也失败，记录到死信队列
        await microservice.queue.publish('dlq.events.failed', {
          topic,
          data,
          error: error.message,
          timestamp: Date.now()
        })
        return false
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## 性能优化

### 连接池管理

```typescript
import { configureMicroservice } from 'uniadapter/go'

configureMicroservice({
  rpc: {
    connectionPool: {
      min: 5,    // 最小连接数
      max: 20,   // 最大连接数
      idleTimeout: 30000, // 空闲超时时间
      acquireTimeout: 10000 // 获取连接超时时间
    }
  }
})
```

### 批量操作

```typescript
import { microservice } from 'uniadapter/go'

// 批量获取用户信息
static async getUsersBatch(userIds: string[]) {
  return await microservice.rpc('UserService.GetUsersBatch', { userIds })
}

// 批量处理消息
microservice.queue.subscribe('user.events.batch-update', async (batchData) => {
  const { userIds, updateFields } = batchData
  
  // 批量更新用户信息
  await microservice.rpc('UserService.BatchUpdate', {
    userIds,
    updateFields
  })
})
```

## 监控与日志

### 性能监控

```typescript
import { microservice } from 'uniadapter/go'

// 添加监控中间件
microservice.use(async (ctx, next) => {
  const startTime = Date.now()
  
  try {
    await next()
    
    // 记录成功调用
    console.log(`RPC 调用 ${ctx.method} 成功，耗时: ${Date.now() - startTime}ms`)
  } catch (error) {
    // 记录失败调用
    console.error(`RPC 调用 ${ctx.method} 失败，耗时: ${Date.now() - startTime}ms`, error)
    throw error
  }
})
```

## 安全考虑

### 认证与授权

```typescript
import { microservice } from 'uniadapter/go'

// 添加认证中间件
microservice.use(async (ctx, next) => {
  const token = ctx.headers.authorization
  
  if (!token) {
    throw new Error('缺少认证令牌')
  }
  
  try {
    // 验证令牌
    const userInfo = await verifyToken(token)
    ctx.user = userInfo
    await next()
  } catch (error) {
    throw new Error('认证失败')
  }
})
```

### 数据验证

```typescript
import { microservice } from 'uniadapter/go'

// 在 RPC 调用前验证数据
function validateUserData(userData: any) {
  if (!userData.email || !isValidEmail(userData.email)) {
    throw new Error('无效的邮箱地址')
  }
  
  if (!userData.username || userData.username.length < 3) {
    throw new Error('用户名长度不能少于3个字符')
  }
}

static async createUser(userData: any) {
  validateUserData(userData) // 验证数据
  
  return await microservice.rpc('UserService.CreateUser', userData)
}
```

## 最佳实践

### 1. 服务设计原则

- **单一职责**: 每个微服务应只负责一个业务领域
- **高内聚低耦合**: 服务内部高度相关，服务间依赖尽量少
- **无状态设计**: 服务本身不应保存状态，状态应存储在外部存储中

### 2. 错误恢复

- **优雅降级**: 当某个服务不可用时，应用应能继续提供基本功能
- **熔断机制**: 防止故障传播，快速失败并尝试恢复
- **重试策略**: 合理的重试次数和间隔，避免雪崩效应

### 3. 监控与运维

- **健康检查**: 定期检查服务健康状况
- **性能监控**: 监控响应时间、吞吐量等指标
- **日志记录**: 详细的日志记录便于问题排查

通过 UniAdapter 的 Go 分布式系统集成，您可以构建健壮、可扩展的微服务架构，实现前后端的无缝集成。