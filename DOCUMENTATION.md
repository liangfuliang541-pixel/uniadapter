# UniAdapter 完整项目文档

## 📚 文档目录

### 🎯 核心文档
- [README.md](./README.md) - 项目主文档和快速入门
- [PLATFORM_SUPPORT.md](./PLATFORM_SUPPORT.md) - 多平台支持详细说明
- [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md) - npm包发布指南

### 🏗️ 技术文档
- [uniadapter-architecture.md](./uniadapter-architecture.md) - 技术架构设计
- [PROJECT_SUMMARY_REPORT.md](./PROJECT_SUMMARY_REPORT.md) - 项目总结报告
- [PLATFORM_EXTENSION_SUMMARY.md](./PLATFORM_EXTENSION_SUMMARY.md) - 平台扩展总结

### 📋 开发文档
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [CHANGELOG.md](./CHANGELOG.md) - 版本变更记录
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发环境配置

## 🗂️ 项目结构

```
uniadapter/
├── src/                    # 源代码目录
│   ├── core/              # 核心适配器层
│   │   ├── adapters/     # 平台适配器
│   │   │   ├── h5.ts     # H5适配器
│   │   │   ├── douyin.ts # 抖音小程序适配器
│   │   │   ├── amap.ts   # 高德地图适配器
│   │   │   └── xiaohongshu.ts # 小红书适配器
│   │   ├── types/        # 类型定义
│   │   └── __tests__/    # 核心测试
│   ├── hooks/            # 统一Hook API
│   │   ├── useUniState.ts
│   │   ├── useUniRouter.ts
│   │   └── __tests__/    # Hook测试
│   └── components/       # 跨平台组件
├── docs/                 # 详细文档
├── examples/            # 使用示例
├── tests/               # 集成测试
├── .github/             # GitHub配置
│   └── workflows/       # CI/CD流程
├── dist/                # 构建产物
└── package.json         # 项目配置
```

## 🎯 快速导航

### 🔧 开发者指南
- [开发环境配置](./DEVELOPMENT.md)
- [API参考文档](./docs/api-reference.md)
- [最佳实践](./docs/best-practices.md)

### 🚀 用户指南
- [快速入门](./README.md#🚀-快速开始)
- [平台适配指南](./PLATFORM_SUPPORT.md)
- [常见问题解答](./docs/faq.md)

### 🏢 企业使用
- [商业授权](./LICENSE)
- [技术支持](./docs/support.md)
- [定制开发](./docs/customization.md)

## 📞 联系信息

**📧 技术支持邮箱**: 3578544805@qq.com  
**👨‍💻 项目维护者**: liangfuliang541-pixel  
**🏢 所属公司**: 福建省小南同学网络科技有限公司  
**🌐 项目主页**: https://github.com/liangfuliang541-pixel/uniadapter

## 📄 版权声明

本项目为开源软件，采用 MIT 许可证。
版权所有 © 2024-2025 福建省小南同学网络科技有限公司