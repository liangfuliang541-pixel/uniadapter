# 🚀 UniAdapter - 智能多端适配器框架

![License](https://img.shields.io/github/license/liangfuliang541-pixel/uniadapter)
![Version](https://img.shields.io/npm/v/uniadapter)
![Downloads](https://img.shields.io/npm/dm/uniadapter)
![Stars](https://img.shields.io/github/stars/liangfuliang541-pixel/uniadapter)
![Forks](https://img.shields.io/github/forks/liangfuliang541-pixel/uniadapter)
![Build Status](https://img.shields.io/github/actions/workflow/status/liangfuliang541-pixel/uniadapter/test.yml)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Platform Support](https://img.shields.io/badge/Platform-9%2B_Supported-orange)
![Contributors](https://img.shields.io/github/contributors/liangfuliang541-pixel/uniadapter)
![Last Commit](https://img.shields.io/github/last-commit/liangfuliang541-pixel/uniadapter)

**一套代码，适配所有平台** | [文档](./docs) | [示例](./examples) | [贡献](./CONTRIBUTING.md) | [统计信息](./STATISTICS.md)

UniAdapter 是一个创新的多端适配框架，通过适配器模式解决前端开发中跨平台兼容的痛点问题，让开发者能够专注于业务逻辑而非平台差异。最新版本已支持Go分布式系统，实现从前端到后端微服务的统一适配，是业界首个支持全栈开发的适配框架。

## 📋 项目概览

**项目名称**: UniAdapter - 智能多端适配器框架  
**项目定位**: 让前端开发者一套代码轻松适配所有平台  
**核心理念**: Write Once, Run Everywhere with Intelligence  
**当前版本**: v1.2.0  
**联系方式**: 3578544805@qq.com  
**版权所有**: © 2024-2025 福建省小南同学网络科技有限公司

**仓库地址**: https://github.com/liangfuliang541-pixel/uniadapter

## 🎯 核心价值

- **统一API**: 一套代码适配Web、小程序、APP、地图服务、Go微服务等多个平台
- **智能检测**: 自动识别运行环境并选择最优适配方案
- **零侵入性**: 现有项目可渐进式采用，无需重构
- **高性能**: 编译时优化，运行时零开销
- **类型安全**: 完整的TypeScript支持和智能提示
- **全栈支持**: 前端到Go后端微服务的统一适配
- **生态丰富**: 支持Nx monorepo、ESLint、Prettier等现代开发工具
- **文档完善**: 详细的API文档和丰富的使用示例

## 📱 支持平台

| 平台 | 标识 | 特色功能 |
|------|------|----------|
| 🌐 Web/H5 | `h5` | 浏览器API完整适配 |
| 🐦 微信小程序 | `weapp` | 微信生态深度集成 |
| 🤲 支付宝小程序 | `alipay` | 支付、金融、生活服务集成 |
| 🎵 抖音小程序 | `douyin` | 音视频、社交分享优化 |
| 📝 小红书小程序 | `xiaohongshu` | 社区内容分享 |
| 🗺️ 高德地图 | `amap` | 位置服务、路线导航 |
| 📱 React Native | `react-native` | 原生移动应用 |
| 🔧 Go分布式系统 | `go-distributed` | 微服务、RPC、消息队列、服务发现 |
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

### 🔥 支付宝小程序适配
- 支付功能集成
- 金融服务API适配
- 人脸验证支持
- 生活号功能集成
- 小程序码生成与扫描

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

### 🔧 Go分布式系统
- 微服务架构支持
- RPC远程过程调用
- 消息队列与事件驱动
- 服务注册与发现
- 分布式锁与协调
- 负载均衡与容错

## 🏗️ 架构设计

### 适配器模式
```
应用代码 → 统一API → 适配器工厂 → 平台适配器
                              ├─ H5适配器
                              ├─ 小程序适配器
                              │  ├─ 微信小程序
                              │  ├─ 支付宝小程序
                              │  ├─ 抖音小程序
                              │  └─ 小红书小程序
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

## 📊 项目统计

| 指标 | 数据 | 说明 |
|------|------|------|
| 核心库体积 | < 5KB (Gzipped) | 经过Tree-shaking优化 |
| 启动时间 | < 50ms | 快速初始化 |
| 运行时开销 | 0 | 无额外性能消耗 |
| 支持平台数 | 9+ | Web、小程序、APP、Go微服务等 |
| 包含组件数 | 15+ | 丰富的适配器和Hook |
| GitHub Stars | 💫 | 持续增长中 |
| npm下载量 | 📈 | 快速增长中 |
| 贡献者 | 👥 | 欢迎加入 |

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

## 🌟 贡献与发展

### 版本规划
- ✅ v1.0 - 基础多端适配框架
- ✅ v1.1 - 新增抖音、高德、小红书支持
- ✅ v1.2 - 新增Go分布式系统支持
- ✅ v1.2.1 - 新增支付宝小程序支持
- 🔜 v2.0 - AI能力集成与生态扩展

### 开源生态
- MIT License 开源协议
- 欢迎社区贡献和反馈
- 定期发布更新和改进

## 📞 联系方式

**📧 邮箱**: 3578544805@qq.com  
**👨‍💻 开发者**: liangfuliang541-pixel  
**🏢 公司**: 福建省小南同学网络科技有限公司  
**🌐 GitHub**: [https://github.com/liangfuliang541-pixel/uniadapter](https://github.com/liangfuliang541-pixel/uniadapter)

## 📄 版权声明

© 2024-2025 福建省小南同学网络科技有限公司. 保留所有权利。

本项目采用 MIT 许可证开源，详细信息请查看 [LICENSE](./LICENSE) 文件。

---

## 🌟 让前端开发更简单，让一份代码跨越所有的终端界限！

[问题反馈](https://github.com/liangfuliang541-pixel/uniadapter/issues) · [功能建议](https://github.com/liangfuliang541-pixel/uniadapter/discussions) · [贡献指南](./CONTRIBUTING.md) · [项目统计](./STATISTICS.md)