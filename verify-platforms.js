// 验证平台检测功能
console.log('=== 平台检测验证 ===')

// 模拟不同平台环境
const testCases = [
  {
    name: 'H5平台',
    setup: () => {
      global.window = {}
      global.document = {}
      global.navigator = { userAgent: 'Mozilla/5.0' }
    }
  },
  {
    name: '抖音小程序',
    setup: () => {
      global.tt = { version: '1.0.0' }
    }
  },
  {
    name: '小红书小程序',
    setup: () => {
      global.xhs = { version: '1.0.0' }
    }
  },
  {
    name: '微信小程序',
    setup: () => {
      global.wx = { version: '1.0.0' }
    }
  },
  {
    name: 'React Native',
    setup: () => {
      global.navigator = { product: 'ReactNative' }
    }
  },
  {
    name: '高德地图',
    setup: () => {
      global.AMap = { version: '1.0.0' }
    }
  }
]

// 简单的平台检测实现
function detectPlatform() {
  if (typeof global.tt !== 'undefined') {
    return 'douyin'
  }
  if (typeof global.xhs !== 'undefined') {
    return 'xiaohongshu'
  }
  if (typeof global.wx !== 'undefined') {
    return 'weapp'
  }
  if (typeof global.navigator !== 'undefined' && global.navigator.product === 'ReactNative') {
    return 'react-native'
  }
  if (typeof global.AMap !== 'undefined') {
    return 'amap'
  }
  if (typeof global.window !== 'undefined' && typeof global.document !== 'undefined') {
    return 'h5'
  }
  return 'unknown'
}

// 运行测试
for (const testCase of testCases) {
  // 重置环境
  delete global.window
  delete global.document
  delete global.navigator
  delete global.tt
  delete global.xhs
  delete global.wx
  delete global.AMap
  
  // 设置测试环境
  testCase.setup()
  
  // 检测平台
  const result = detectPlatform()
  console.log(`${testCase.name}: ${result}`)
  
  // 验证结果
  const expected = testCase.name.split(' ')[0].toLowerCase()
  const expectedMap = {
    'h5': 'h5',
    '抖音': 'douyin',
    '小红书': 'xiaohongshu',
    '微信': 'weapp',
    'react': 'react-native',
    '高德': 'amap'
  }
  
  const expectedPlatform = expectedMap[expected] || 'unknown'
  console.log(`  ✓ 期望: ${expectedPlatform}, 实际: ${result}, ${result === expectedPlatform ? '通过' : '失败'}`)
}

console.log('\n=== 验证完成 ===')