# API 参考文档

## 核心 Hook

### usePlatform
获取当前运行平台的信息。

```typescript
import { usePlatform } from 'uniadapter'

function MyComponent() {
  const platform = usePlatform()
  
  return (
    <div>
      当前平台: {platform.name}
      平台类型: {platform.type}
    </div>
  )
}
```

#### 返回值
- `name`: 平台名称 (如 'web', 'weapp', 'douyin')
- `type`: 平台类型 ('h5', 'mini-program', 'app', 'go-distributed')
- `version`: 平台版本
- `isWeb`: 是否为Web平台
- `isMobile`: 是否为移动平台
- `capabilities`: 平台能力对象

### useUniState
跨平台统一的状态管理Hook。

```typescript
import { useUniState } from 'uniadapter'

function Counter() {
  const [count, setCount] = useUniState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

#### 参数
- `initialValue`: 初始状态值

#### 返回值
- `[state, setState]`: 状态值和设置函数的数组

### useUniRouter
跨平台统一的路由管理Hook。

```typescript
import { useUniRouter } from 'uniadapter'

function NavigationButton() {
  const { push, replace, goBack } = useUniRouter()
  
  return (
    <div>
      <button onClick={() => push('/detail')}>
        跳转详情页
      </button>
      <button onClick={() => goBack()}>
        返回
      </button>
    </div>
  )
}
```

#### 返回值
- `push(path)`: 跳转到指定路径
- `replace(path)`: 替换当前页面
- `goBack()`: 返回上一页
- `getCurrentPath()`: 获取当前路径

### useUniRequest
跨平台统一的网络请求Hook。

```typescript
import { useUniRequest } from 'uniadapter'

function DataFetcher() {
  const { get, post, put, del } = useUniRequest()
  const [data, setData] = useUniState(null)
  
  const fetchData = async () => {
    try {
      const response = await get('/api/data')
      setData(response.data)
    } catch (error) {
      console.error('请求失败:', error)
    }
  }
  
  return (
    <div>
      <button onClick={fetchData}>获取数据</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

#### 返回值
- `get(url, options)`: GET请求
- `post(url, data, options)`: POST请求
- `put(url, data, options)`: PUT请求
- `del(url, options)`: DELETE请求

## 适配器 API

### 存储适配器
```typescript
import { storage } from 'uniadapter/adapters'

// 存储数据
await storage.set('key', value)

// 获取数据
const value = await storage.get('key')

// 删除数据
await storage.remove('key')

// 清空存储
await storage.clear()
```

### 位置适配器
```typescript
import { location } from 'uniadapter/adapters'

// 获取当前位置
const position = await location.getCurrentPosition()

// 获取位置权限状态
const permission = await location.getPermissionStatus()

// 地址解析
const address = await location.getAddressFromCoords(lat, lng)
```

### 相机适配器
```typescript
import { camera } from 'uniadapter/adapters'

// 拍照
const photo = await camera.takePhoto({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080
})

// 选择相册图片
const photos = await camera.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed']
})
```

### 生物识别适配器
```typescript
import { biometric } from 'uniadapter/adapters'

// 检查生物识别支持
const supported = await biometric.isSupported()

// 生物识别认证
const authenticated = await biometric.authenticate({
  title: '请验证身份',
  subtitle: '用于访问敏感信息',
  description: '使用指纹或面容ID进行验证'
})
```

### 通知适配器
```typescript
import { notification } from 'uniadapter/adapters'

// 请求通知权限
const granted = await notification.requestPermission()

// 显示通知
await notification.show({
  title: '通知标题',
  content: '通知内容',
  icon: '/icon.png',
  timeout: 5000
})
```

## 平台检测

### platformDetection
```typescript
import { platformDetection } from 'uniadapter'

console.log({
  type: platformDetection.type,           // 平台类型
  isWeb: platformDetection.isWeb,         // 是否为Web
  isMobile: platformDetection.isMobile,   // 是否为移动端
  name: platformDetection.name,           // 平台名称
  version: platformDetection.version      // 平台版本
})
```

## Go分布式系统API

### 微服务客户端
```typescript
import { microservice } from 'uniadapter/go'

// RPC调用
const result = await microservice.rpc('UserService.GetUser', {
  userId: '123'
})

// 消息队列
await microservice.queue.publish('user.events.created', {
  userId: '123',
  timestamp: Date.now()
})

// 服务发现
const serviceInstance = await microservice.discovery.find('UserService')
```

## 工具函数

### 类型判断
```typescript
import { isWechatMiniProgram, isDingtalkMiniProgram, isWeb } from 'uniadapter/utils'

if (isWechatMiniProgram()) {
  // 微信小程序特定逻辑
}

if (isWeb()) {
  // Web端特定逻辑
}
```

### 环境工具
```typescript
import { getEnvInfo } from 'uniadapter/utils'

const env = getEnvInfo()
console.log('当前环境信息:', env)
```