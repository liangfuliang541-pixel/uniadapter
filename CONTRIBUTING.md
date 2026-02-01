# 🤝 UniAdapter 贡献指南

欢迎参与 UniAdapter 项目！我们很高兴您想要为这个多端适配框架做出贡献。

## 🎯 贡献方式

### 🐛 报告问题
- 使用 [GitHub Issues](https://github.com/liangfuliang541-pixel/uniadapter/issues) 报告bug
- 详细描述复现步骤和环境信息
- 提供最小可复现示例

### 💡 功能建议
- 在 [Discussions](https://github.com/liangfuliang541-pixel/uniadapter/discussions) 中提出新功能想法
- 描述使用场景和解决的问题
- 讨论技术实现方案

### 📝 代码贡献
- Fork 项目并创建功能分支
- 遵循代码规范和提交信息格式
- 添加相应的测试用例
- 确保所有测试通过

## 🛠️ 开发环境设置

### 1. 克隆项目
```bash
git clone https://github.com/liangfuliang541-pixel/uniadapter.git
cd uniadapter
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

### 4. 运行测试
```bash
npm test
npm run coverage
```

## 📋 代码规范

### TypeScript 规范
- 使用严格模式 (`strict: true`)
- 明确的类型定义
- 避免使用 `any` 类型
- 合理使用泛型

### 提交信息格式
```
type(scope): description

详细描述（可选）

关闭的问题：#123
```

**Type 类型**：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

### 代码审查标准
- ✅ 通过所有测试
- ✅ TypeScript编译无错误
- ✅ 代码覆盖率 ≥ 80%
- ✅ 遵循项目代码风格
- ✅ 包含适当的文档更新

## 🧪 测试要求

### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- src/core/__tests__/platform-detection.test.ts

# 生成覆盖率报告
npm run coverage
```

### 测试覆盖要求
- 新增功能测试覆盖率 ≥ 80%
- 核心模块测试覆盖率 ≥ 90%
- 适配器测试覆盖率 ≥ 85%

## 📦 发布流程

### 版本管理
遵循 [语义化版本](https://semver.org/) 规范：
- 主版本：不兼容的API变更
- 次版本：向后兼容的功能新增
- 补丁版本：向后兼容的问题修正

### 发布步骤
1. 更新版本号：`npm version [major|minor|patch]`
2. 构建发布版本：`npm run build:lib`
3. 发布到npm：`npm publish`

## 🎨 项目架构

### 核心原则
- **适配器模式**：统一接口，多种实现
- **零运行时开销**：编译时优化
- **渐进式采用**：现有项目可逐步迁移
- **类型安全**：完整的TypeScript支持

### 目录结构
```
src/
├── core/          # 核心适配器逻辑
├── hooks/         # 统一Hook API
├── components/    # 跨平台组件
└── __tests__/     # 测试文件
```

## 📞 联系方式

**📧 技术支持**: 3578544805@qq.com  
**👨‍💻 维护者**: liangfuliang541-pixel  
**🏢 公司**: 福建省小南同学网络科技有限公司

## 📄 许可证

本项目采用 MIT 许可证开源，详细信息请查看 [LICENSE](./LICENSE) 文件。

---

感谢您的贡献！🎉 让我们一起让前端开发变得更简单！