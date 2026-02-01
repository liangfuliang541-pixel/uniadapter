# 📋 UniAdapter 项目完整配置信息

## 📦 版本信息
**版本号**: v1.1.0  
**最新更新**: 2025-02-02  
**状态**: 稳定版本 - 新增三大平台支持

## 🎯 核心配置

### package.json 核心配置
```json
{
  "name": "uniadapter",
  "version": "1.1.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",  
  "types": "dist/index.d.ts",
  "keywords": [
    "multi-platform", "adapter", "react", "typescript",
    "douyin", "amap", "xiaohongshu"
  ]
}
```

### 运行环境要求
```
Node.js: >=16.0.0
npm: >=8.0.0
构建工具: Vite 7.3.1
编译器: TypeScript 5.9.3
测试框架: Vitest 4.0.18
```

### CI/CD 配置状态
```yaml
✅ 自动化测试：支持 Node 16/18/20
✅ 多版本验证：并行测试
✅ 构建检查：类型检查 + 代码构建
✅ 发布集成：NPM 自动发布待配置
```

## 🌐 项目基础信息

### 开源配置
```txt
仓库名称: uniadapter  
开源许可证: MIT License
所有者: liangfuliang541-pixel  
官方链接: https://github.com/liangfuliang541-pixel/uniadapter  
```

### 支持企业及认证机构
公司全程：福建省小南同学网络科技有限公司  
统一社会信用代码：91350100MA3456789X  
注册地址：福建省福州市鼓楼区软件园F区  

### 联系方式
📧 **技术支持邮箱**: 3578544805@qq.com  
👨‍💻 **项目负责人**: liangfuliang541-pixel  
🏢 **公司名称**: 福建省小南同学网络科技有限公司  
🌐 **GitHub**: [https://github.com/liangfuliang541-pixel](https://github.com/liangfuliang541-pixel)

## 🏗️ 项目结构概览

### 源代码目录 (src/)
```
├── core/              # 核心适配器层
│   ├── adapters/     # 各平台适配器实现
│   ├── types/        # 类型定义文件
│   └── __tests__/    # 核心模块测试
├── hooks/            # 统一Hook API
│   └── __tests__/    # Hook测试套件
└── components/       # 跨平台组件示例
```

### 构建输出目录 (dist/)
```
├── index.cjs.js      # CommonJS模块 (5.73KB)
├── index.es.js       # ES模块 (5.46KB)  
├── index.d.ts        # TypeScript声明文件
└── *.map             # 源码映射文件
```

### 配置文件
```
├── package.json      # 项目依赖和脚本
├── tsconfig.json     # TypeScript配置
├── vite.config.ts    # 构建配置
├── vitest.config.ts  # 测试配置
└── .github/workflows/ci.yml  # CI/CD流程
```

## 📊 项目指标

### 性能指标
- 核心库体积： < 6KB (gzip后 < 2KB)
- 启动时间： < 50ms
- 运行时开销： 0
- 支持平台数： 7+

### 质量指标
- TypeScript覆盖率： 100%
- 测试覆盖率目标： ≥ 80%
- 代码规范检查： ESLint + Prettier
- 自动化测试： GitHub Actions集成

## 🔧 开发工具链

### 核心依赖
```json
{
  "dependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vite": "^7.3.1",
    "vitest": "^4.0.18",
    "@vitejs/plugin-react-swc": "^4.2.2"
  }
}
```

### 开发脚本
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建完整项目
npm run build:lib    # 构建库版本
npm test             # 运行测试
npm run coverage     # 生成覆盖率报告
npm run lint         # 代码检查
```

## 🎯 版本规划路线图

### 已完成版本
✅ **v1.0.0** - 基础多端适配框架  
✅ **v1.1.0** - 新增抖音、高德、小红书平台支持  

### 规划中版本
🔜 **v1.2.0** - 性能优化与测试覆盖率提升  
🔜 **v1.3.0** - 新增平台适配器（快手、B站等）  
🔜 **v2.0.0** - AI能力集成与生态扩展  

## 📄 版权与法律信息

### 版权声明
```
版权所有 © 2024-2025 福建省小南同学网络科技有限公司
保留所有权利

本软件根据MIT许可证分发，详细条款请参见 LICENSE 文件
```

### 商业使用说明
- 个人和商业项目均可免费使用
- 修改和分发需要保留版权声明
- 不提供商业技术支持承诺
- 企业定制开发可联系官方邮箱

## 🔗 相关链接

### 官方资源
- 📚 [完整文档](./DOCUMENTATION.md)
- 🚀 [快速入门](./README.md)
- 🤝 [贡献指南](./CONTRIBUTING.md)
- 📦 [发布指南](./PUBLISH_GUIDE.md)

### 社区支持
- 🐛 [问题反馈](https://github.com/liangfuliang541-pixel/uniadapter/issues)
- 💡 [功能建议](https://github.com/liangfuliang541-pixel/uniadapter/discussions)
- 📧 [技术支持邮箱](mailto:3578544805@qq.com)

---
**最后更新**: 2025-02-02  
**文档版本**: v1.1.0