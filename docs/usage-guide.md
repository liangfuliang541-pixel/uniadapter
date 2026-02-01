# 使用指南

## 快速开始

### 安装

通过 npm 安装：

```bash
npm install uniadapter
```

或者通过 yarn 安装：

```bash
yarn add uniadapter
```

### 基础使用

最简单的使用方式是从 UniAdapter 导入你需要的 Hook：

```typescript
import { usePlatform, useUniState, useUniRouter } from 'uniadapter'

function MyComponent() {
  // 自动检测当前平台
  const platform = usePlatform()
  console.log('当前平台:', platform.name)
  
  // 统一的状态管理
  const [count, setCount] = useUniState(0)
  
  // 统一的路由操作
  const { push, replace } = useUniRouter()
  
  // 所有平台使用相同的API
  const handleClick = () => {
    setCount(count + 1)
    push('/next-page')
  }
  
  return <button onClick={handleClick}>Count: {count}</button>
}
```

## 平台适配

### 检测当前平台

```typescript
import { usePlatform } from 'uniadapter'

function PlatformSpecificComponent() {
  const platform = usePlatform()
  
  if (platform.name === 'weapp') {
    return <WechatMiniProgramView />
  } else if (platform.name === 'douyin') {
    return <DouyinMiniProgramView />
  } else {
    return <WebView />
  }
}
```

### 条件渲染

```typescript
import { usePlatform } from 'uniadapter'

function ConditionalFeature() {
  const platform = usePlatform()
  
  return (
    <div>
      <h1>通用功能</h1>
      
      {platform.capabilities.hasCamera && (
        <button onClick={takePhoto}>拍照</button>
      )}
      
      {platform.capabilities.hasBiometric && (
        <button onClick={authenticate}>生物识别</button>
      )}
    </div>
  )
}
```

## 状态管理

### 基础状态管理

```typescript
import { useUniState } from 'uniadapter'

function Counter() {
  const [count, setCount] = useUniState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
    </div>
  )
}
```

### 对象状态管理

```typescript
import { useUniState } from 'uniadapter'

function UserProfile() {
  const [user, setUser] = useUniState({
    name: '',
    email: '',
    age: 0
  })
  
  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }))
  }
  
  return (
    <div>
      <input 
        value={user.name} 
        onChange={(e) => updateName(e.target.value)} 
        placeholder="姓名"
      />
      <p>你好, {user.name}!</p>
    </div>
  )
}
```

## 路由管理

### 页面导航

```typescript
import { useUniRouter } from 'uniadapter'

function NavigationExample() {
  const { push, replace, goBack } = useUniRouter()
  
  return (
    <div>
      <button onClick={() => push('/detail/123')}>
        跳转详情页
      </button>
      <button onClick={() => replace('/profile')}>
        替换当前页
      </button>
      <button onClick={goBack}>
        返回上一页
      </button>
    </div>
  )
}
```

### 参数传递

```typescript
import { useUniRouter } from 'uniadapter'

function PassParams() {
  const { push } = useUniRouter()
  
  const goToDetail = () => {
    push('/detail', {
      params: { id: '123' },
      query: { tab: 'info', lang: 'zh' }
    })
  }
  
  return <button onClick={goToDetail}>查看详情</button>
}
```

## 网络请求

### 基础请求

```typescript
import { useUniRequest } from 'uniadapter'

function DataFetching() {
  const { get, post } = useUniRequest()
  const [users, setUsers] = useUniState([])
  
  const fetchUsers = async () => {
    try {
      const response = await get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('获取用户失败:', error)
    }
  }
  
  const createUser = async (userData) => {
    try {
      await post('/api/users', userData)
      fetchUsers() // 重新获取用户列表
    } catch (error) {
      console.error('创建用户失败:', error)
    }
  }
  
  return (
    <div>
      <button onClick={fetchUsers}>获取用户</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 带请求头的请求

```typescript
import { useUniRequest } from 'uniadapter'

function AuthenticatedRequest() {
  const { get } = useUniRequest()
  
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('authToken')
    
    try {
      const response = await get('/api/protected-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('请求失败:', error)
    }
  }
  
  return <button onClick={fetchProtectedData}>获取受保护数据</button>
}
```

## 存储管理

### 使用存储适配器

```typescript
import { storage } from 'uniadapter/adapters'
import { useUniState } from 'uniadapter'

function StorageExample() {
  const [username, setUsername] = useUniState('')
  
  // 组件挂载时从存储读取数据
  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await storage.get('username')
      if (savedUsername) {
        setUsername(savedUsername)
      }
    }
    
    loadUsername()
  }, [])
  
  // 保存用户名到存储
  const saveUsername = async (name) => {
    await storage.set('username', name)
    setUsername(name)
  }
  
  return (
    <div>
      <input 
        value={username}
        onChange={(e) => saveUsername(e.target.value)}
        placeholder="输入用户名"
      />
      <p>当前用户名: {username}</p>
    </div>
  )
}
```

## 高级用法

### 自定义 Hook

基于 UniAdapter 创建自己的 Hook：

```typescript
import { useUniState, useUniRequest } from 'uniadapter'

// 自定义数据获取 Hook
function useUserData(userId) {
  const [data, setData] = useUniState(null)
  const [loading, setLoading] = useUniState(false)
  const [error, setError] = useUniState(null)
  const { get } = useUniRequest()
  
  const fetchUser = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await get(`/api/users/${userId}`)
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return { data, loading, error, fetchUser }
}

// 在组件中使用
function UserProfile({ userId }) {
  const { data: user, loading, error, fetchUser } = useUserData(userId)
  
  useEffect(() => {
    fetchUser()
  }, [userId])
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return user ? (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  ) : null
}
```

### 平台特定逻辑封装

```typescript
import { usePlatform } from 'uniadapter'
import { useEffect } from 'react'

// 封装平台特定的行为
function usePlatformBehavior() {
  const platform = usePlatform()
  
  useEffect(() => {
    if (platform.name === 'weapp') {
      // 微信小程序特定逻辑
      wx.setKeepScreenOn({ keepScreenOn: true })
    } else if (platform.name === 'douyin') {
      // 抖音小程序特定逻辑
      tt.setKeepScreenOn({ keepScreenOn: true })
    } else {
      // Web 端特定逻辑
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }
    
    return () => {
      if (platform.name === 'web') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [platform.name])
  
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('页面隐藏')
    } else {
      console.log('页面显示')
    }
  }
}

// 在组件中使用
function MyComponent() {
  usePlatformBehavior()
  
  return <div>我的组件</div>
}
```

## Go分布式系统集成

### 微服务调用

```typescript
import { microservice } from 'uniadapter/go'

// 调用用户服务
async function getUserProfile(userId) {
  try {
    const result = await microservice.rpc('UserService.GetProfile', {
      userId: userId
    })
    
    return result.data
  } catch (error) {
    console.error('获取用户资料失败:', error)
    throw error
  }
}

// 发布用户事件
async function publishUserEvent(eventType, eventData) {
  await microservice.queue.publish(`user.${eventType}`, eventData)
}

// 查找服务实例
async function findService(serviceName) {
  const instance = await microservice.discovery.find(serviceName)
  return instance
}
```

### 分布式锁

```typescript
import { microservice } from 'uniadapter/go'

async function criticalSectionOperation(resourceId) {
  // 获取分布式锁
  const lockKey = `resource_${resourceId}`
  const lock = await microservice.lock.acquire(lockKey, 30000) // 30秒超时
  
  if (!lock) {
    throw new Error('无法获取分布式锁')
  }
  
  try {
    // 执行关键区域操作
    await performResourceOperation(resourceId)
  } finally {
    // 释放锁
    await microservice.lock.release(lockKey)
  }
}
```

## 最佳实践

### 错误处理

```typescript
import { useUniState } from 'uniadapter'

function ErrorHandlingExample() {
  const [data, setData] = useUniState(null)
  const [error, setError] = useUniState(null)
  const [loading, setLoading] = useUniState(false)
  
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 执行可能失败的操作
      const result = await someAsyncOperation()
      setData(result)
    } catch (err) {
      setError(err.message || '未知错误')
      console.error('操作失败:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return <div>{/* 渲染数据 */}</div>
}
```

### 性能优化

```typescript
import { useMemo, useCallback } from 'react'
import { useUniState } from 'uniadapter'

function PerformanceOptimization() {
  const [items, setItems] = useUniState([])
  const [filter, setFilter] = useUniState('')
  
  // 使用 useMemo 优化计算密集型操作
  const filteredItems = useMemo(() => {
    if (!filter) return items
    
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])
  
  // 使用 useCallback 优化事件处理器
  const handleAddItem = useCallback((item) => {
    setItems(prev => [...prev, item])
  }, [setItems])
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="过滤..."
      />
      <ItemList items={filteredItems} onAddItem={handleAddItem} />
    </div>
  )
}
```

## 调试技巧

### 启用调试模式

```typescript
import { initDebug } from 'uniadapter'

// 在开发环境中启用详细调试信息
if (process.env.NODE_ENV === 'development') {
  initDebug({ level: 'verbose' })
}
```

### 平台信息查看

```typescript
import { usePlatform } from 'uniadapter'

function DebugPlatform() {
  const platform = usePlatform()
  
  console.log('平台信息:', {
    name: platform.name,
    type: platform.type,
    version: platform.version,
    capabilities: platform.capabilities
  })
  
  return <div>查看控制台获取平台信息</div>
}
```