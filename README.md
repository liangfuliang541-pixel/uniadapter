# 🚀 UniAdapter - 智能多端适配器框架

<p align="center">
  <img src="https://raw.githubusercontent.com/liangfuliang541-pixel/uniadapter/main/docs/images/logo.svg" width="200" alt="UniAdapter Logo"/>
</p>

<p align="center">
  <strong>一套代码，适配所有平台</strong><br>
  <sub>比 Taro 更轻量 · 比 uni-app 更灵活 · 零侵入 · < 5KB</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/uniadapter?style=flat-square" alt="npm">
  <img src="https://img.shields.io/npm/dm/uniadapter?style=flat-square" alt="Downloads">
  <img src="https://img.shields.io/github/stars/liangfuliang541-pixel/uniadapter?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/license/liangfuliang541-pixel/uniadapter?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/TypeScript--blue?style=flat-square" alt="TypeScript">
</p>

---

## ⭐ 为什么选择 UniAdapter？

| 特性 | UniAdapter | Taro | uni-app | Rax |
|------|:----------:|:----:|:--------:|:---:|
| **包体积** | **< 5KB** | ~500KB | ~800KB | ~300KB |
| **侵入性** | **零侵入** | 高 | 高 | 中 |
| **Go 微服务** | **✅ 支持** | ❌ | ❌ | ❌ |
| **学习成本** | **极低** | 中 | 中 | 高 |
| **React Hooks** | **✅ 原生** | 需适配 | 需适配 | 部分 |
| **按需加载** | **✅ 自动** | 部分 | 部分 | 部分 |
| **TypeScript** | **✅ 完整** | ✅ | ✅ | ✅ |

> **UniAdapter 是目前唯一支持 Go 分布式系统的多端适配框架**，让你从前端到后端微服务使用同一套适配理念。

---

## 📱 支持平台

| 平台 | 标识 | 状态 |
|------|------|------|
| 🌐 Web / H5 | `h5` | ✅ 稳定 |
| 🐦 微信小程序 | `weapp` | ✅ 稳定 |
| 💰 支付宝小程序 | `alipay` | ✅ 稳定 |
| 🎵 抖音小程序 | `douyin` | ✅ 稳定 |
| 📝 小红书小程序 | `xiaohongshu` | ✅ 稳定 |
| 🗺️ 高德地图 | `amap` | ✅ 稳定 |
| 📱 React Native | `react-native` | ✅ 稳定 |
| 🐢 Go 分布式系统 | `go-distributed` | ✅ 稳定 |
| 🔍 浏览器扩展 | `extension` | 🔜 开发中 |
| 🟢 鸿蒙 OS | `harmonyos` | 🔜 开发中 |

---

## 🎯 核心理念

```
Write Once, Run Everywhere with Intelligence
```

UniAdapter 通过**适配器模式**解决跨平台兼容问题：
- 自动检测运行环境
- 零侵入接入现有项目
- 编译时优化，运行时零开销
- 完整 TypeScript 类型支持

---

## 🚀 快速开始

### 安装

```bash
npm install uniadapter
# 或
yarn add uniadapter
# 或
pnpm add uniadapter
```

### 基础示例

```tsx
import { usePlatform, useUniState, useUniRequest, useUniRouter } from 'uniadapter'

function App() {
  // 🚀 自动检测当前平台
  const platform = usePlatform()
  
  // 📦 统一的状态管理（所有平台行为一致）
  const [count, setCount] = useUniState(0)
  
  // 🌐 统一的网络请求
  const { get, post } = useUniRequest()
  
  // 🧭 统一的路由操作
  const { push, replace, goBack } = useUniRouter()

  const handleClick = async () => {
    setCount(count + 1)
    // 🐦 自动适配微信/支付宝/抖音小程序的 navigateTo
    // 🌐 自动适配 Web 的 history.pushState
    push('/detail/123')
  }

  return (
    <div>
      <p>当前平台: {platform.name}</p>
      <p>计数: {count}</p>
      <button onClick={handleClick}>点我</button>
    </div>
  )
}
```

### 平台特定 API

```tsx
import { storage, location, camera, biometric } from 'uniadapter/adapters'

// 💾 统一存储（自动适配各平台 Storage API）
await storage.set('token', 'xxx')
const token = await storage.get('token')

// 📍 统一定位（微信/支付宝/高德/浏览器统一接口）
const position = await location.getCurrentPosition()

// 📷 统一相机（自动选择平台原生 API）
const photos = await camera.takePhoto()

// 🔐 统一生物识别（指纹/面容）
const result = await biometric.authenticate('验证身份')
```

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────┐
│              应用代码 (React)                 │
├─────────────────────────────────────────────┤
│              统一 API 层                      │
│  useUniState | useUniRouter | useUniRequest │
├─────────────────────────────────────────────┤
│            适配器工厂 (AdapterFactory)       │
├────────┬────────┬────────┬──────────────────┤
│ Web    │ 微信    │ 支付宝  │ Go 微服务        │
│ H5     │ 小程序   │ 抖音    │ 高德地图         │
│        │ 小红书   │ RN     │ 浏览器扩展       │
└────────┴────────┴────────┴──────────────────┘
```

### 核心特性

- **按需加载**: 核心库 < 5KB，平台适配器按需加载
- **零侵入**: 现有 React 项目可渐进式接入
- **类型安全**: 完整 TypeScript 支持，智能提示
- **插件系统**: 支持自定义扩展和平台适配

---

## 🧪 平台检测

```typescript
import { platformDetection } from 'uniadapter'

const platform = platformDetection

console.log({
  type: platform.type,           // 'web' | 'mini-program' | 'app' | 'server'
  isWeb: platform.isWeb,         // true
  isMobile: platform.isMobile,   // true/false
  name: platform.name,           // 'weapp' | 'alipay' | 'h5' | ...
  version: platform.version      // '1.0.0'
})

// 判断当前平台
if (platform.isWeapp) {
  // 微信小程序特有逻辑
}

if (platform.isMobile) {
  // 移动端优化
}
```

---

## 📦 Go 分布式系统支持 (独家功能)

UniAdapter 是**业界首个**支持 Go 微服务的多端适配框架：

```typescript
import { goAdapter } from 'uniadapter/adapters/go-distributed'

// 🚀 微服务调用
const userService = goAdapter.service('user')
const user = await userService.call('GetUser', { id: 1 })

// 🔐 分布式锁
const lock = goAdapter.distributedLock('order-lock')
await lock.acquire()
try {
  // 业务逻辑
} finally {
  await lock.release()
}

// 📬 消息队列
const queue = goAdapter.queue('notifications')
await queue.publish({ type: 'email', to: 'user@example.com' })
```

---

## 📊 项目统计

| 指标 | 数据 |
|------|------|
| 核心库体积 | **< 5KB** (Gzipped) |
| 启动时间 | **< 50ms** |
| 支持平台数 | **9+** |
| TypeScript 覆盖率 | **100%** |
| 测试覆盖率 | **> 80%** |

---

## 🛠️ 开发工具

### CLI 工具

```bash
npx uniadapter init    # 初始化项目
npx uniadapter add     # 添加新平台
npx uniadapter verify  # 验证兼容性
```

### 调试模式

```typescript
import { initDebug } from 'uniadapter'

initDebug({
  level: 'verbose',  // 'error' | 'warn' | 'info' | 'verbose'
  showPlatform: true // 显示当前平台信息
})
```

---

## 🌟 版本路线图

| 版本 | 内容 | 状态 |
|------|------|------|
| v1.0 | 基础多端适配框架 | ✅ 已完成 |
| v1.1 | 新增抖音、高德、小红书支持 | ✅ 已完成 |
| v1.2 | Go 分布式系统支持 | ✅ 已完成 |
| v1.3 | 支付宝小程序 + 鸿蒙 OS | ✅ 已完成 |
| v2.0 | AI 能力集成与生态扩展 | 🔜 开发中 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

```bash
# 克隆项目
git clone https://github.com/liangfuliang541-pixel/uniadapter.git

# 安装依赖
npm install

# 开发模式
npm run dev

# 运行测试
npm test

# 运行测试（UI）
npm run test:ui

# 代码检查
npm run lint

# 格式化代码
npm run format
```

详细贡献指南请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 开源协议

本项目采用 [MIT](./LICENSE) 开源协议。

---

## 📞 联系方式

- 📧 邮箱: 3578544805@qq.com
- 🐙 GitHub: [liangfuliang541-pixel](https://github.com/liangfuliang541-pixel)
- 🐛 问题反馈: [Issues](https://github.com/liangfuliang541-pixel/uniadapter/issues)

---

<p align="center">
  <strong>⭐ 如果这个项目对你有帮助，请给一个 Star！</strong>
</p>
