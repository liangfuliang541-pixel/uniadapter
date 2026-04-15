# 🎯 UniAdapter 贡献指南

感谢您对 UniAdapter 感兴趣！无论您是想修复一个 Bug、添加一个新平台适配器，还是改进文档，我们都欢迎您的贡献。

---

## 🔰 快速开始（5分钟上手）

### 第一步：安装 & 运行

```bash
# 1. Fork 并克隆你的仓库
git clone https://github.com/YOUR_USERNAME/uniadapter.git
cd uniadapter

# 2. 安装依赖
npm install

# 3. 启动开发模式
npm run dev

# 4. 运行测试
npm test
```

**提示**：项目使用 [Nx](https://nx.dev/) 管理 monorepo，如果遇到问题，运行 `npx nx reset` 重置缓存。

---

## 🐛 如何找任务

### 适合新手的任务（Good First Issues）

我们使用 GitHub Labels 标记任务难度：

| Label | 难度 | 说明 |
|-------|:----:|------|
| `good first issue` | ⭐ | 最佳入门任务，不需要深入了解代码 |
| `help wanted` | ⭐⭐ | 欢迎帮助，但我们能提供指导 |
| `enhancement` | ⭐⭐ | 新功能或改进 |
| `platform-adapter` | ⭐⭐ | 添加新平台适配器 |

👉 [查看 Good First Issues](https://github.com/liangfuliang541-pixel/uniadapter/issues?q=label%3A%22good+first+issue%22+is%3Aopen)

### 常见贡献类型

1. **🐛 修复 Bug** - 报告即修复，附带测试
2. **🌐 添加新平台** - 参考现有适配器（如 `src/core/adapters/alipay.ts`）
3. **📖 改进文档** - 修复错别字、补充示例、翻译
4. **⚡ 性能优化** - 减少包体积、提升运行效率
5. **🧪 增加测试** - 提高测试覆盖率

---

## 🏗️ 项目结构

```
uniadapter/
├── src/
│   ├── core/                    # 核心适配器引擎
│   │   ├── adapters/            # 平台适配器
│   │   │   ├── index.ts        # 适配器导出
│   │   │   ├── interfaces.ts   # 适配器接口定义
│   │   │   ├── h5.ts           # Web/H5 适配器
│   │   │   ├── alipay.ts       # 支付宝小程序适配器
│   │   │   ├── douyin.ts       # 抖音小程序适配器
│   │   │   └── go-distributed.ts # Go 微服务适配器
│   │   ├── adapter.ts          # 核心适配器类
│   │   ├── platform-detector.ts # 平台检测
│   │   └── plugin-system/      # 插件系统
│   ├── hooks/                   # React Hooks
│   │   ├── useUniState.ts      # 统一状态管理
│   │   ├── useUniRouter.ts      # 统一路由
│   │   └── useUniRequest.ts     # 统一网络请求
│   └── index.ts                # 主入口
├── docs/                        # 文档
└── examples/                   # 示例代码
```

---

## 🔧 开发指南

### 添加新平台适配器（以抖音小程序为例）

**1. 创建适配器文件** `src/core/adapters/douyin.ts`:

```typescript
import { BaseAdapter, PlatformType } from '../adapter'

export class DouyinAdapter extends BaseAdapter {
  readonly type = PlatformType.MINI_PROGRAM
  readonly name = 'douyin'

  // 重写平台特有 API
  getExtraInfo() {
    return {
      ...super.getExtraInfo(),
      appName: 'douyin',
    }
  }

  // 实现 storage API
  storage = {
    get: (key: string) => tt.getStorageSync(key),
    set: (key: string, value: any) => tt.setStorageSync(key, value),
    remove: (key: string) => tt.removeStorageSync(key),
    clear: () => tt.clearStorageSync(),
  }

  // 实现路由 API
  router = {
    push: (url: string) => tt.navigateTo({ url }),
    replace: (url: string) => tt.redirectTo({ url }),
    back: () => tt.navigateBack(),
  }

  // 实现请求 API
  request = {
    get: (url: string, options?: RequestOptions) => 
      tt.request({ url, method: 'GET', ...options }),
    post: (url: string, data?: any, options?: RequestOptions) => 
      tt.request({ url, method: 'POST', data, ...options }),
  }
}
```

**2. 注册适配器** 在 `src/core/adapters/index.ts` 中添加：

```typescript
export { DouyinAdapter } from './douyin'
```

**3. 添加平台检测** 在 `src/core/platform-detector.ts` 中添加检测逻辑

**4. 编写测试** 在 `src/core/adapters/__tests__/douyin.test.ts`:

```typescript
import { DouyinAdapter } from '../douyin'

describe('DouyinAdapter', () => {
  it('should have correct platform name', () => {
    const adapter = new DouyinAdapter()
    expect(adapter.name).toBe('douyin')
  })

  it('should implement storage API', () => {
    const adapter = new DouyinAdapter()
    expect(adapter.storage).toBeDefined()
    expect(adapter.storage.get).toBeDefined()
  })
})
```

**5. 更新文档** 在 `docs/douyin-integration.md` 添加使用说明

---

## 📝 提 PR 流程

1. **Fork 仓库** 到你的 GitHub 账号
2. **创建分支**：
   ```bash
   # 新功能
   git checkout -b feat/your-feature-name
   
   # Bug 修复
   git checkout -b fix/issue-description
   
   # 文档改进
   git checkout -b docs/improve-something
   ```
3. **编写代码** + **添加测试**
4. **确保测试通过**：
   ```bash
   npm run test        # 运行测试
   npm run lint        # 检查代码规范
   npm run format      # 自动格式化
   ```
5. **提交代码**（遵循 Commit 规范）：
   ```bash
   # 格式: <type>(<scope>): <description>
   git commit -m 'feat(adapters): add Douyin mini-program support'
   git commit -m 'fix(hooks): correct useUniState initial value handling'
   git commit -m 'docs: add Douyin integration guide'
   ```
6. **Push 并创建 PR**：
   ```bash
   git push origin your-branch-name
   ```
   然后在 GitHub 上创建 Pull Request。

### Commit 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(hooks): add useI18n hook` |
| `fix` | Bug 修复 | `fix(adapter): correct alipay storage bug` |
| `docs` | 文档 | `docs: add contribution guide` |
| `style` | 格式调整 | `style: format code with prettier` |
| `refactor` | 重构 | `refactor: simplify platform detection` |
| `test` | 测试 | `test: add useUniState coverage` |
| `chore` | 构建/工具 | `chore: upgrade dependencies` |

---

## 🧪 测试指南

```bash
# 运行所有测试
npm test

# 监听模式（开发时）
npm run test:watch

# 带 UI 界面
npm run test:ui

# 生成覆盖率报告
npm run coverage

# 只运行单个测试文件
npx vitest run src/hooks/useUniState.test.ts
```

---

## 📖 文档贡献

### 文档目录

```
docs/
├── README.md           # 文档首页
├── index.html         # docsify 入口
├── _sidebar.md        # 侧边栏配置
├── usage-guide.md      # 使用指南
├── api-reference.md    # API 参考
├── alipay-integration.md
├── go-integration.md
├── project-overview.md
└── en/                # 英文文档
    └── README.md
```

### 编写文档规范

- 使用中文（简体）
- 代码示例使用 TypeScript
- 每个 API 都要有示例代码
- 添加常见问题 FAQ

---

## 🆘 遇到问题？

| 渠道 | 说明 |
|------|------|
| GitHub Issues | Bug 报告、功能建议 |
| GitHub Discussions | 开放讨论、Q&A |
| Email | 3578544805@qq.com |

---

## 📄 许可证

贡献 UniAdapter 即表示您同意您的贡献将遵循 [MIT](./LICENSE) 开源协议。

---

**让我们一起让前端开发更简单！ 🚀**
