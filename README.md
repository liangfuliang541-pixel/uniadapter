iang# UniAdapter 2.0

**用自然语言描述功能，AI 自动生成跨端最优代码。**

一个框架，解决微信/支付宝/抖音/小红书小程序的适配痛点。

[![npm](https://img.shields.io/npm/v/@liangfu/uniadapter?style=flat-square)](https://www.npmjs.com/package/@liangfu/uniadapter)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 安装

```bash
npm install @liangfu/uniadapter
```

## 快速开始

### 方式一：直接使用适配器（无需 AI）

```typescript
import { createStorageAdapter, useUniRequest } from '@liangfu/uniadapter'

// 存储 — 自动适配当前平台
const storage = await createStorageAdapter()
await storage.set('token', 'user_token_123')
const token = await storage.get('token')

// HTTP 请求（React Hook）
function UserList() {
  const { get, post } = useUniRequest()
  return <button onClick={() => get('/api/users')}>获取</button>
}
```

### 方式二：VibeEngine（AI 代码生成）

```typescript
import { VibeEngine } from '@liangfu/uniadapter'

const engine = new VibeEngine({ platform: 'weapp' })

const { code } = await engine.generate({
  prompt: '实现图片上传，支持压缩和进度显示',
})

console.log(code)
// 自动生成微信小程序最优实现
```

### 方式三：VibeMCP（Cursor/Claude Code 插件）

在 Cursor/Windsurf 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "vibemcp": {
      "command": "npx",
      "args": ["@liangfu/uniadapter", "mcp"]
    }
  }
}
```

然后直接在 AI 助手中描述需求：

> "帮我做一个电商小程序，包含商品列表、购物车、支付"

---

## 支持的平台

| 平台 | Storage | Request | Router | Share | 备注 |
|------|---------|---------|---------|--------|-------|
| 微信小程序 | ✅ | ✅ | ✅ | ✅ | 完整实现 |
| 支付宝小程序 | ✅ | ✅ | ✅ | ⚠️ 部分 | 部分 API 差异 |
| 抖音小程序 | ✅ | ✅ | ✅ | ✅ | 完整实现 |
| 小红书小程序 | ✅ | ✅ | ✅ | ⚠️ 部分 | 部分 API 差异 |
| Web/H5 | ✅ | ✅ | ✅ | ⚠️ 部分 | 浏览器限制 |
| 高德地图 | ✅ | ✅ | ✅ | — | 原生 API 封装 |

> 标注 ⚠️ 的功能为部分实现，请参考 API 文档确认具体支持情况。

---

## 核心 API

### Storage（存储）

```typescript
import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()
await storage.set(key, value)
const val = await storage.get(key)
await storage.remove(key)
await storage.clear()
```

### HTTP 请求（React）

```typescript
import { useUniRequest } from '@liangfu/uniadapter'

function App() {
  const { get, post, loading } = useUniRequest()
  return <button onClick={() => get('/api/users')}>加载</button>
}
```

### 平台检测

```typescript
import { usePlatform } from '@liangfu/uniadapter'

const { name, isWeapp, isAlipay, isDouyin } = usePlatform()
```

---

## VibeEngine 意图识别

| 意图 | 关键词 | 生成内容 |
|------|--------|---------|
| storage | 存/取/删/token | Storage API 最优实现 |
| request | 请求/加载/fetch | 跨平台请求适配代码 |
| navigation | 跳转/导航/返回 | 页面路由代码 |
| ui | 显示/列表/弹窗 | UI 组件代码 |
| system | 分享/登录/定位 | 平台系统能力调用 |

---

## 环境变量

```bash
# 至少配置一个
OPENAI_API_KEY=sk-xxx
# 或
DEEPSEEK_API_KEY=sk-xxx
# 或
ANTHROPIC_API_KEY=sk-xxx
```

---

## 构建发布

```bash
npm install
npm run build      # 构建所有平台
npm run build -- --platform weapp   # 只构建微信小程序
npm run test       # 运行测试
npm publish        # 发布 npm
```

---

## License

MIT License © 2026 [liangfuliang541-pixel](https://github.com/liangfuliang541-pixel)
