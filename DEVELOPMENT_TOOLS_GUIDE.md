# UniAdapter 开发工具链使用指南

本项目集成了现代化的前端开发工具链，旨在提高开发效率、代码质量和团队协作。

## 🛠️ 工具概览

### Nx 工作区管理
- 统一管理项目中的多个应用和库
- 提供增量构建和测试功能
- 智能依赖图分析

### 代码质量工具
- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **TypeScript**: 静态类型检查（严格模式）

### 组件开发与文档
- **Storybook**: 组件可视化开发环境
- **JSDoc/TSdoc**: 代码文档生成

### CI/CD 流程
- **GitHub Actions**: 自动化测试与部署
- **Husky & Lint Staged**: Git钩子预检
- **Commitlint**: 提交信息规范化

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 代码检查与格式化
```bash
# 检查代码规范
npm run lint

# 自动修复代码规范问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# 类型检查
npm run type-check
```

### 3. 测试
```bash
# 运行测试
npm run test

# 运行测试（无UI）
npm run test:run

# 测试覆盖率报告
npm run coverage

# 启动测试UI界面
npm run test:ui
```

### 4. 组件开发
```bash
# 启动Storybook
npm run storybook

# 构建Storybook
npm run build-storybook
```

### 5. 构建
```bash
# 构建项目
npm run build

# 构建库文件
npm run build:lib

# 清理构建产物
npm run clean
```

## 📚 开发规范

### Git 提交规范
本项目使用 conventional commits 规范，提交信息格式如下：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

支持的类型:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变更

### 代码规范
- 使用 TypeScript 严格模式
- 使用 ESLint 进行代码规范检查
- 使用 Prettier 进行代码格式化
- 使用 JSDoc/TSdoc 注释公共API

## 🚀 CI/CD 流程

### 自动化测试
- 提交代码时自动运行类型检查
- 提交代码时自动运行 ESLint 检查
- 提交代码时自动运行单元测试
- 计算测试覆盖率并上传到 Codecov

### 构建验证
- PR 合并前自动构建验证
- main 分支更新后自动构建

## 📁 项目结构

```
.github/              # GitHub 配置文件
  └── workflows/      # CI/CD 工作流
.storybook/           # Storybook 配置
src/
  ├── components/     # 可视化组件
  ├── core/           # 核心适配器逻辑
  ├── hooks/          # React hooks
  └── lib/            # 库文件
.commitlintrc.js      # Commitlint 配置
.eslintrc.json        # ESLint 配置
.prettierrc           # Prettier 配置
nx.json               # Nx 工作区配置
tsconfig.strict.json  # TypeScript 严格模式配置
```

## 🔧 集成工具说明

### Nx 工作区
Nx 是一个智能的构建系统，提供以下功能：
- 任务运行器：智能缓存和增量构建
- 依赖图：可视化项目依赖关系
- 代码生成：快速创建应用和库

### Storybook
用于组件驱动开发，提供：
- 组件隔离开发环境
- 交互式文档
- 视觉回归测试

### Husky 和 Lint Staged
在 Git 提交前自动运行代码检查：
- 格式化代码
- 修复 ESLint 问题
- 验证提交信息格式

这套现代化的开发工具链将帮助团队保持高质量的代码标准，提高开发效率和协作效果。