# UniAdapter - 智能多端适配器框架

## 项目概述

UniAdapter是一个创新性的智能多端适配框架，专为解决前端开发者在多平台开发中的痛点而设计。通过统一的API接口和智能适配机制，让开发者可以专注于业务逻辑，而无需关心不同平台的技术差异。

## 核心特性

### 1. 统一API设计
- `useUniState<T>` - 统一状态管理
- `useUniRouter()` - 统一路由管理
- `useUniRequest()` - 统一网络请求
- `usePlatform()` - 平台检测

### 2. 智能平台检测
自动识别运行环境并选择最优适配方案，支持：
- Web平台
- 小程序平台
- 移动App平台
- 桌面应用平台

### 3. 适配器模式
通过适配器模式，统一接口屏蔽不同平台的实现差异，实现一套代码适配所有平台。

## 技术架构

```
应用层 → 统一API → 适配器工厂 → 具体平台适配器
```

## 快速开始

### 安装
```bash
npm install uniadapter
```

### 基础使用
```tsx
import { useUniState, useUniRouter, useUniRequest } from 'uniadapter'

function MyComponent() {
  // 统一状态管理
  const [user, setUser] = useUniState({ name: '', age: 0 })
  
  // 统一路由管理
  const { navigate } = useUniRouter()
  
  // 统一网络请求
  const { request } = useUniRequest()
  
  const handleLogin = async () => {
    const userData = await request({
      url: '/api/login',
      method: 'POST',
      data: { username, password }
    })
    setUser(userData)
    navigate('/dashboard')
  }
  
  return <div>智能多端适配组件</div>
}
```

## 项目结构

```
src/
├── core/                      # 核心架构层
│   ├── platform-detector.ts   # 平台检测器
│   └── adapter.ts            # 抽象适配器基类
├── hooks/                     # React统一Hooks
│   ├── usePlatform.ts        # 平台检测Hook
│   ├── useUniState.ts        # 统一状态管理
│   ├── useUniRouter.ts       # 统一路由适配
│   └── useUniRequest.ts      # 统一网络请求
├── platforms/                 # 平台特定实现
│   └── storage.ts            # 统一存储适配器
└── components/               # 可复用UI组件
    └── MultiPlatformDemo.tsx # 多平台展示演示
```

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 本地开发
```bash
# 克隆项目
git clone https://github.com/liangfuliang541-pixel/uniadapter.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 贡献指南

我们欢迎任何形式的贡献！

### 开发流程
1. Fork项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交Pull Request

### 代码规范
- 使用TypeScript编写
- 遵循ESLint规则
- 添加必要的注释
- 保持代码简洁优雅

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- GitHub: https://github.com/liangfuliang541-pixel/uniadapter
- Issues: https://github.com/liangfuliang541-pixel/uniadapter/issues

---

<div align="center">

**让多端开发变得更简单** 🚀

Made with ❤️ by the UniAdapter Team

</div>