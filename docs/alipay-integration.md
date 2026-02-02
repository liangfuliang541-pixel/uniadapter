# 支付宝小程序集成指南

## 概述

UniAdapter 现在支持支付宝小程序，为开发者提供了一套统一的 API 接口来访问支付宝小程序的特有能力，包括支付、金融服务、生活服务等。

## 支持的功能

### 核心功能
- **存储管理**: 使用支付宝小程序的存储 API
- **网络请求**: 统一的 HTTP 请求接口
- **状态管理**: 跨平台状态管理
- **路由管理**: 统一路由接口

### 支付宝小程序特有能力
- **支付功能**: 集成支付宝支付 API
- **金融服务**: 信贷、理财、保险等服务
- **生活服务**: 水电煤缴费、交通出行等
- **生物识别**: 人脸识别验证
- **授权管理**: 用户信息授权

## 快速开始

### 检测支付宝小程序环境

```typescript
import { usePlatform } from 'uniadapter'

function checkAlipayEnvironment() {
  const platform = usePlatform()
  
  if (platform.type === 'alipay') {
    console.log('当前在支付宝小程序环境中')
    return true
  } else {
    console.log('当前不在支付宝小程序环境')
    return false
  }
}
```

### 基础使用

```typescript
import { 
  usePlatform, 
  useUniState, 
  storage,
  biometric
} from 'uniadapter'

function AlipayFeatures() {
  const platform = usePlatform()
  const [userInfo, setUserInfo] = useUniState({})
  
  // 检查是否为支付宝小程序
  if (platform.type !== 'alipay') {
    return <div>此功能仅在支付宝小程序中可用</div>
  }
  
  // 使用支付宝小程序特有能力
  const handlePayment = async () => {
    if (typeof my !== 'undefined') {
      // 调用支付宝支付
      my.tradePay({
        orderStr: 'your_order_info',
        success: (res) => {
          console.log('支付成功', res)
        },
        fail: (err) => {
          console.error('支付失败', err)
        }
      })
    }
  }
  
  return (
    <div>
      <h2>支付宝小程序功能</h2>
      <button onClick={handlePayment}>发起支付</button>
    </div>
  )
}
```

## 支付功能集成

### 发起支付

```typescript
async function initiatePayment(orderInfo) {
  // 确保在支付宝小程序环境中
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持支付功能')
    return
  }
  
  try {
    const result = await new Promise((resolve, reject) => {
      my.tradePay({
        orderStr: orderInfo.orderString, // 订单字符串
        timeout: 30000, // 支付超时时间
        success: (res) => {
          if (res.tradeNO) {
            console.log('支付成功，交易号:', res.tradeNO)
            resolve(res)
          } else {
            reject(new Error('支付失败'))
          }
        },
        fail: (error) => {
          console.error('支付失败:', error)
          reject(error)
        }
      })
    })
    
    return result
  } catch (error) {
    console.error('支付过程中出现错误:', error)
    throw error
  }
}
```

### 订单信息示例

```typescript
const orderInfo = {
  orderString: 'partner="2088..."&seller_id="2088..."&out_trade_no="..."&subject="商品名称"&body="商品描述"&total_fee="0.01"&notify_url="http://example.com/notify"',
  timeout: 30000
}

// 发起支付
await initiatePayment(orderInfo)
```

## 用户授权与信息获取

### 获取用户授权码

```typescript
async function getUserAuthCode() {
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持用户授权')
    return null
  }
  
  try {
    const authResult = await new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes: 'auth_user,auth_phone', // 请求的授权范围
        success: (res) => {
          console.log('授权成功:', res)
          resolve(res.authCode)
        },
        fail: (error) => {
          console.error('授权失败:', error)
          reject(error)
        }
      })
    })
    
    // 存储授权码
    await storage.set('alipay_auth_code', authResult)
    
    return authResult
  } catch (error) {
    console.error('获取授权码失败:', error)
    return null
  }
}
```

### 获取用户手机号

```typescript
async function getUserPhoneNumber() {
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持获取手机号')
    return null
  }
  
  try {
    const phoneResult = await new Promise((resolve, reject) => {
      my.getPhoneNumber({
        success: (res) => {
          console.log('获取手机号成功:', res)
          resolve(res)
        },
        fail: (error) => {
          console.error('获取手机号失败:', error)
          reject(error)
        }
      })
    })
    
    // 存储手机号信息
    await storage.set('alipay_phone_info', phoneResult)
    
    return phoneResult
  } catch (error) {
    console.error('获取手机号过程中出现错误:', error)
    return null
  }
}
```

## 生物识别认证

### 人脸识别

```typescript
async function faceVerification() {
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持人脸识别')
    return false
  }
  
  try {
    const verificationResult = await new Promise((resolve, reject) => {
      my.startFacialRecognitionVerify({
        name: '身份验证', // 验证名称
        idCardNumber: '330...', // 身份证号（脱敏）
        success: (res) => {
          console.log('人脸识别成功:', res)
          resolve(true)
        },
        fail: (error) => {
          console.error('人脸识别失败:', error)
          resolve(false)
        }
      })
    })
    
    return verificationResult
  } catch (error) {
    console.error('人脸识别过程中出现错误:', error)
    return false
  }
}
```

## 生活服务功能

### 打开生活号

```typescript
async function openLifeCircle(lifeAppId) {
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持打开生活号')
    return
  }
  
  try {
    my.openLifeChannel({
      appId: lifeAppId,
      success: () => {
        console.log('成功打开生活号')
      },
      fail: (error) => {
        console.error('打开生活号失败:', error)
      }
    })
  } catch (error) {
    console.error('打开生活号过程中出现错误:', error)
  }
}
```

### 跳转到支付宝特定页面

```typescript
async function navigateToAlipayPage(page) {
  const platform = usePlatform()
  if (platform.type !== 'alipay') {
    console.warn('仅在支付宝小程序中支持跳转到支付宝页面')
    return
  }
  
  try {
    switch (page) {
      case 'my':
        // 跳转到我的页面
        my.navigateTo({
          url: 'alipay://appcenter/my'
        })
        break
      case 'pay':
        // 跳转到付款页面
        my.navigateTo({
          url: 'alipay://platformapi/startapp?appId=10000001'
        })
        break
      default:
        console.warn('不支持的页面类型')
    }
  } catch (error) {
    console.error('跳转到支付宝页面失败:', error)
  }
}
```

## 安全与隐私

### 数据加密存储

```typescript
import { storage } from 'uniadapter/adapters'

async function secureStorage(data) {
  // 对敏感数据进行加密存储
  const encryptedData = await encryptSensitiveData(data)
  await storage.set('secure_user_data', encryptedData)
}

async function encryptSensitiveData(data) {
  // 实现数据加密逻辑
  // 这里简化处理，实际项目中应使用更强的加密算法
  const jsonString = JSON.stringify(data)
  const encoded = btoa(encodeURIComponent(jsonString))
  return encoded
}

async function decryptSensitiveData(encryptedData) {
  // 实现数据解密逻辑
  try {
    const decoded = decodeURIComponent(atob(encryptedData))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('数据解密失败:', error)
    return null
  }
}
```

## 最佳实践

### 条件渲染支付宝特有能力

```typescript
import { usePlatform } from 'uniadapter'

function ConditionalFeatures() {
  const platform = usePlatform()
  
  return (
    <div>
      <h3>通用功能</h3>
      <p>这些功能在所有平台都可用</p>
      
      {platform.type === 'alipay' && (
        <div className="alipay-specific">
          <h3>支付宝特有能力</h3>
          <button onClick={initiatePayment}>支付宝支付</button>
          <button onClick={getUserPhoneNumber}>获取手机号</button>
          <button onClick={faceVerification}>人脸识别</button>
        </div>
      )}
    </div>
  )
}
```

### 错误处理与降级方案

```typescript
async function payWithFallback(amount) {
  const platform = usePlatform()
  
  if (platform.type === 'alipay') {
    // 尝试使用支付宝支付
    try {
      const result = await initiatePayment({
        orderString: generateOrderString(amount)
      })
      return result
    } catch (error) {
      console.warn('支付宝支付失败，尝试其他支付方式:', error)
      // 降级到其他支付方式
      return await alternativePayment(amount)
    }
  } else {
    // 非支付宝环境，使用其他支付方式
    return await alternativePayment(amount)
  }
}
```

## 调试技巧

### 检查支付宝环境

```typescript
function debugAlipayEnvironment() {
  console.log('全局对象 my 是否存在:', typeof my !== 'undefined')
  console.log('my.canIUse 是否存在:', typeof my?.canIUse !== 'undefined')
  
  if (typeof my !== 'undefined') {
    console.log('支付宝小程序 API 版本:', my.SDKVersion)
  }
}
```

### 模拟支付宝环境（开发调试用）

```typescript
// 注意：仅在开发环境使用，生产环境不要包含此代码
if (process.env.NODE_ENV === 'development' && typeof my === 'undefined') {
  // 模拟支付宝全局对象
  global.my = {
    tradePay: (options) => {
      console.log('模拟支付调用:', options)
      options.success && options.success({ tradeNO: 'mock_trade_no_123' })
    },
    getAuthCode: (options) => {
      console.log('模拟获取授权码')
      options.success && options.success({ authCode: 'mock_auth_code_123' })
    },
    getPhoneNumber: (options) => {
      console.log('模拟获取手机号')
      options.success && options.success({ response: 'mock_phone_number' })
    },
    SDKVersion: '2.0.0'
  }
}
```

## 注意事项

1. **HTTPS 要求**: 支付宝小程序要求所有网络请求都必须使用 HTTPS
2. **域名白名单**: 服务器域名需要在支付宝开放平台配置
3. **权限申请**: 特殊接口需要在小程序后台申请权限
4. **支付证书**: 支付功能需要配置相应的支付证书
5. **用户授权**: 获取用户敏感信息需要明确的用户授权