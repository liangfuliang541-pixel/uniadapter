# 🚀 UniAdapter - 智能多端适配器框架

**一套代码，适配所有平台**

UniAdapter 是一个创新的多端适配框架，通过适配器模式解决前端开发中跨平台兼容的痛点问题，让开发者能够专注于业务逻辑而非平台差异。

## 🎯 核心价值

- **统一API**: 一套代码适配Web、小程序、APP、地图服务等多个平台
- **智能检测**: 自动识别运行环境并选择最优适配方案
- **零侵入性**: 现有项目可渐进式采用，无需重构
- **高性能**: 编译时优化，运行时零开销
- **类型安全**: 完整的TypeScript支持和智能提示

## 📱 支持平台

| 平台 | 标识 | 特色功能 |
|------|------|----------|
| 🌐 Web/H5 | `h5` | 浏览器API完整适配 |
| 🐦 微信小程序 | `weapp` | 微信生态深度集成 |
| 🎵 抖音小程序 | `douyin` | 音视频、社交分享优化 |
| 📝 小红书小程序 | `xiaohongshu` | 社区内容分享 |
| 🗺️ 高德地图 | `amap` | 位置服务、路线导航 |
| 📱 React Native | `react-native` | 原生移动应用 |
| 🔍 浏览器插件 | `extension` | 扩展API支持 |

## 🚀 快速开始

### 安装

```bash
npm install uniadapter
# or
yarn add uniadapter
```

### 基础使用

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

## 🛠️ 核心API

### 平台检测
```typescript
import { platformDetection } from 'uniadapter'

// 获取当前平台信息
const platform = platformDetection
console.log({
  type: platform.type,           // 平台类型
  isWeb: platform.isWeb,         // 是否为Web
  isMobile: platform.isMobile,   // 是否为移动端
  name: platform.name,           // 平台名称
  version: platform.version      // 平台版本
})
```

### 统一Hook

#### useUniState - 状态管理
```typescript
const [state, setState] = useUniState(initialValue)
setState(newValue) // 在所有平台行为一致
```

#### useUniRouter - 路由导航
```typescript
const { push, replace, goBack } = useUniRouter()
push('/detail/123') // 自动适配不同平台路由
```

#### useUniRequest - 网络请求
```typescript
const { get, post, put, del } = useUniRequest()
const data = await get('/api/users')
```

### 平台能力适配器

```typescript
import { 
  storage, 
  location, 
  camera, 
  biometric 
} from 'uniadapter/adapters'

// 存储适配
await storage.set('key', value)
const data = await storage.get('key')

// 定位服务
const position = await location.getCurrentPosition()

// 相机调用
const photos = await camera.takePhoto()

// 生物识别
const authenticated = await biometric.authenticate('请验证身份')
```

## 🎨 特色功能

### 🔧 抖音小程序适配
- 优化音视频播放体验
- 原生分享功能支持
- 直播互动API适配
- 内容创作工具集成

### 🗺️ 高德地图服务
- 位置获取与POI搜索
- 路线规划与导航
- 地图渲染与标记
- 距离计算与围栏

### 📝 小红书集成
- 图文笔记发布
- 商品推荐适配
- 社区互动优化
- KOL内容合作

## 🏗️ 架构设计

### 适配器模式
```
应用代码 → 统一API → 适配器工厂 → 平台适配器
                              ├─ H5适配器
                              ├─ 小程序适配器
                              ├─ 原生APP适配器
                              └─ 服务适配器
```

### 动态加载
- 平台检测按需加载
- 核心库体积 < 5KB
- 完整类型支持

### 类型安全
- TypeScript全支持
- 自动类型推断
- 严格编译检查

## 📈 性能表现

| 指标 | 数据 |
|------|------|
| 核心库体积 | < 5KB |
| 启动时间 | < 50ms |
| 运行时开销 | 0 |
| 包含组件数 | 15+ |

## 🧪 开发支持

### CLI 工具
```bash
npx uniadapter init    # 初始化项目
npx uniadapter add     # 添加新平台
npx uniadapter verify  # 验证兼容性
```

### 调试工具
```typescript
// 启用调试模式
import { initDebug } from 'uniadapter'
initDebug({ level: 'verbose' })
```

## 🌟 社区与贡献

### 问题反馈
[GitHub Issues](https://github.com/uniadapter/uniadapter/issues)

### 功能提案
欢迎提出 [RFC 建议](https://github.com/uniadapter/rfc)

### 开源许可证
MIT License © 2024-2025 UniAdapter

---
🌟 让我们一起简化前端开发！让一份代码跨越所有的终端界限，让更多开发者专心专注应用服务能提构度生可口化的超，简悦代付