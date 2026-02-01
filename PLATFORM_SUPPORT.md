# UniAdapter 多平台支持说明

## 新增平台支持

UniAdapter 现已支持以下平台的适配：

### 🎯 抖音小程序 (Douyin Mini Program)
- **平台标识**: `douyin`
- **API 前缀**: `tt.*`
- **核心能力**: 存储、加密、文件、通知、生物识别、分享
- **特色功能**: 抖音特有的社交分享和内容分发

### 🗺️ 高德地图 (Gaode Map)
- **平台标识**: `amap`
- **API 支持**: 地图展示、位置服务、路线规划
- **核心能力**: 地理位置、地图渲染、路径计算
- **特色功能**: 与高德生态深度集成

### 📱 小红书小程序 (Xiaohongshu Mini Program)
- **平台标识**: `xiaohongshu`
- **API 前缀**: `xhs.*`
- **核心能力**: 社交分享、内容发布、用户互动
- **特色功能**: 小红书社区生态适配

## 平台检测机制

```typescript
import { detectPlatform, Platform } from 'uniadapter'

const currentPlatform = detectPlatform()
// 自动返回: Platform.H5 | Platform.DOUYIN_MINIPROGRAM | 
//           Platform.XIAOHONGSHU | Platform.GAODE_MAP | Platform.UNKNOWN
```

## 统一API使用示例

### 存储适配
```typescript
import { useUniStorage } from 'uniadapter'

function MyComponent() {
  const storage = useUniStorage()
  
  // 在所有平台使用相同的API
  const saveData = async () => {
    await storage.set('user_data', { name: '张三', mood: 'great' })
  }
}
```

### 位置服务
```typescript
import { useUniLocation } from 'uniadapter'

function LocationComponent() {
  const location = useUniLocation()
  
  const getCurrentLocation = async () => {
    // 自动适配不同平台的定位API
    const pos = await location.getCurrentPosition()
    console.log('当前位置:', pos)
  }
}
```

### 社交分享
```typescript
import { useUniShare } from 'uniadapter'

function ShareComponent() {
  const share = useUniShare()
  
  const handleShare = async () => {
    await share({
      title: '我的心情日记',
      text: '记录美好生活',
      url: 'https://example.com/journal'
    })
  }
}
```

## 平台特定能力

### 抖音小程序特色
```typescript
// 抖音特有的视频分享功能
if (platform === Platform.DOUYIN_MINIPROGRAM) {
  await douyinAdapter.shareVideo({
    videoUrl: 'https://example.com/video.mp4',
    title: '精彩时刻'
  })
}
```

### 高德地图特色
```typescript
// 高德地图特有的导航功能
if (platform === Platform.GAODE_MAP) {
  await gaodeAdapter.navigate({
    start: { lat: 39.9, lng: 116.4 },
    end: { lat: 39.8, lng: 116.3 },
    mode: 'driving'
  })
}
```

### 小红书特色
```typescript
// 小红书特有的笔记分享功能
if (platform === Platform.XIAOHONGSHU) {
  await xiaohongshuAdapter.shareNote({
    content: '今日心情分享',
    images: ['image1.jpg', 'image2.jpg'],
    tags: ['#心情日记', '#生活记录']
  })
}
```

## 自动适配流程

1. **平台检测**: `detectPlatform()` 自动识别运行环境
2. **适配器加载**: 根据平台动态加载对应适配器
3. **API 统一**: 提供统一的 API 接口
4. **功能调用**: 业务代码无需关心平台差异

## 开发者注意事项

### 平台兼容性检查
```typescript
import { platformDetection } from 'uniadapter'

// 检查当前平台能力
if (platformDetection.capabilities.hasCamera) {
  // 安全使用相机功能
}
```

### 错误处理
```typescript
try {
  await unifiedAPI.someFunction()
} catch (error) {
  // 统一的错误处理逻辑
  if (error.code === 'PLATFORM_NOT_SUPPORTED') {
    // 处理平台不支持的情况
  }
}
```

### 性能优化
- 平台适配器采用懒加载机制
- 自动检测平台特性，避免不必要的API调用
- 提供合理的默认降级方案

## 未来扩展计划

- 支持更多社交平台小程序
- 集成更多地图服务商
- 添加AI能力适配器
- 扩展AR/VR平台支持