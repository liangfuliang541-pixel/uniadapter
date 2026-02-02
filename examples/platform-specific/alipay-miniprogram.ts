/**
 * 支付宝小程序示例
 * 展示如何在支付宝小程序中使用UniAdapter
 */

import { 
  usePlatform, 
  useUniState, 
  useUniRouter,
  useUniRequest,
  storage,
  location,
  camera,
  biometric,
  notification,
  share
} from '../../src/index'

// 检测当前平台
function checkCurrentPlatform() {
  const platform = usePlatform()
  console.log('当前平台:', platform.name)
  console.log('平台类型:', platform.type)
  console.log('是否为支付宝小程序:', platform.type === 'alipay')
  
  return platform
}

// 存储功能示例
async function storageExample() {
  try {
    // 存储数据
    await storage.set('alipay_user_data', {
      userId: '12345',
      name: '支付宝用户',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    })
    
    // 获取数据
    const userData = await storage.get<any>('alipay_user_data')
    console.log('用户数据:', userData)
    
    // 批量存储
    await storage.setMultiple({
      'temp_data_1': 'value1',
      'temp_data_2': 'value2',
      'temp_data_3': 'value3'
    })
    
    // 批量获取
    const multipleData = await storage.getMultiple(['temp_data_1', 'temp_data_2', 'temp_data_3'])
    console.log('批量数据:', multipleData)
    
    // 获取存储信息
    const storageInfo = await storage.getStorageInfo()
    console.log('存储信息:', storageInfo)
  } catch (error) {
    console.error('存储操作失败:', error)
  }
}

// 位置功能示例
async function locationExample() {
  try {
    // 获取当前位置
    const position = await location.getCurrentPosition()
    console.log('当前位置:', position)
    
    // 获取位置权限状态
    const permission = await location.getPermissionStatus()
    console.log('位置权限:', permission)
    
    // 地址解析
    if (position.coords) {
      const address = await location.getAddressFromCoords(
        position.coords.latitude, 
        position.coords.longitude
      )
      console.log('地址信息:', address)
    }
  } catch (error) {
    console.error('位置操作失败:', error)
  }
}

// 相机功能示例
async function cameraExample() {
  try {
    // 拍照
    const photo = await camera.takePhoto({
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080
    })
    console.log('拍照结果:', photo)
    
    // 选择相册图片
    const photos = await camera.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed']
    })
    console.log('选择图片:', photos)
    
    // 压缩图片
    if (photos && photos.length > 0) {
      const compressedUrl = await camera.compressImage(photos[0], 0.6)
      console.log('压缩后图片:', compressedUrl)
    }
  } catch (error) {
    console.error('相机操作失败:', error)
  }
}

// 生物识别示例
async function biometricExample() {
  try {
    // 检查生物识别支持
    const isSupported = await biometric.isSupported()
    console.log('生物识别支持:', isSupported)
    
    if (isSupported) {
      // 获取生物识别类型
      const bioType = await biometric.getBiometricType()
      console.log('生物识别类型:', bioType)
      
      // 生物识别认证
      const authenticated = await biometric.authenticate('请进行身份验证')
      console.log('认证结果:', authenticated)
    }
  } catch (error) {
    console.error('生物识别操作失败:', error)
  }
}

// 通知功能示例
async function notificationExample() {
  try {
    // 请求通知权限
    const granted = await notification.requestPermission()
    console.log('通知权限:', granted)
    
    if (granted) {
      // 显示通知
      await notification.show({
        title: '支付宝小程序通知',
        content: '这是来自支付宝小程序的通知',
        icon: '/images/icon.png',
        timeout: 5000
      })
    }
  } catch (error) {
    console.error('通知操作失败:', error)
  }
}

// 分享功能示例
async function shareExample() {
  try {
    // 分享内容
    const shared = await share.share({
      title: '分享标题',
      text: '分享描述',
      url: 'https://example.com',
      image: 'https://example.com/image.jpg'
    })
    console.log('分享结果:', shared)
    
    // 复制到剪贴板
    const copied = await share.copyToClipboard('这是要复制的内容')
    console.log('复制结果:', copied)
  } catch (error) {
    console.error('分享操作失败:', error)
  }
}

// 网络请求示例
function requestExample() {
  const { get, post, put, del } = useUniRequest()
  
  // GET请求
  get('/api/alipay/user-info')
    .then(response => {
      console.log('用户信息:', response.data)
    })
    .catch(error => {
      console.error('请求失败:', error)
    })
  
  // POST请求
  post('/api/alipay/order', {
    productId: '123',
    amount: 99.99,
    payMethod: 'alipay'
  })
    .then(response => {
      console.log('订单创建结果:', response.data)
    })
    .catch(error => {
      console.error('订单创建失败:', error)
    })
}

// 状态管理示例
function stateManagementExample() {
  const [count, setCount] = useUniState(0)
  const [userInfo, setUserInfo] = useUniState({
    name: '',
    avatar: '',
    balance: 0
  })
  
  // 更新计数
  const increment = () => {
    setCount(count + 1)
  }
  
  // 更新用户信息
  const updateUserInfo = (newInfo: any) => {
    setUserInfo(prev => ({ ...prev, ...newInfo }))
  }
  
  console.log('当前计数:', count)
  console.log('用户信息:', userInfo)
  
  return {
    count,
    increment,
    userInfo,
    updateUserInfo
  }
}

// 路由功能示例
function routerExample() {
  const { push, replace, goBack } = useUniRouter()
  
  // 跳转到支付页面
  const goToPayment = () => {
    push('/pages/payment', {
      params: { orderId: '12345' },
      query: { amount: '99.99' }
    })
  }
  
  // 替换当前页面
  const replaceWithHome = () => {
    replace('/pages/home')
  }
  
  return {
    goToPayment,
    replaceWithHome,
    goBack
  }
}

// 综合示例：支付宝小程序登录流程
async function alipayLoginFlow() {
  console.log('开始支付宝小程序登录流程...')
  
  try {
    // 1. 检测平台
    const platform = checkCurrentPlatform()
    if (platform.type !== 'alipay') {
      console.warn('当前不在支付宝小程序环境中')
      return
    }
    
    // 2. 获取用户授权
    console.log('请求用户授权...')
    const authResult = await new Promise((resolve) => {
      // 支付宝小程序登录逻辑
      if (typeof my !== 'undefined') {
        my.getAuthCode({
          scopes: 'auth_user',
          success: (res: any) => {
            console.log('授权成功:', res)
            resolve(res.authCode)
          },
          fail: (error: any) => {
            console.error('授权失败:', error)
            resolve(null)
          }
        })
      } else {
        resolve(null)
      }
    })
    
    if (!authResult) {
      console.error('用户未授权，无法完成登录')
      return
    }
    
    // 3. 存储授权信息
    await storage.set('alipay_auth_code', authResult)
    console.log('授权码已存储')
    
    // 4. 获取用户信息
    const userInfo = await new Promise((resolve) => {
      if (typeof my !== 'undefined') {
        my.getPhoneNumber({
          success: (res: any) => {
            console.log('获取手机号成功:', res)
            resolve(res.response)
          },
          fail: (error: any) => {
            console.error('获取手机号失败:', error)
            resolve(null)
          }
        })
      } else {
        resolve(null)
      }
    })
    
    // 5. 存储用户信息
    if (userInfo) {
      await storage.set('alipay_user_info', userInfo)
      console.log('用户信息已存储')
    }
    
    // 6. 显示欢迎消息
    await notification.show({
      title: '登录成功',
      content: '欢迎使用支付宝小程序',
      timeout: 3000
    })
    
    console.log('支付宝小程序登录流程完成')
  } catch (error) {
    console.error('支付宝小程序登录流程失败:', error)
  }
}

// 初始化支付宝小程序示例
export async function initAlipayExample() {
  console.log('初始化支付宝小程序示例...')
  
  // 检测平台
  const platform = checkCurrentPlatform()
  
  // 运行所有示例
  if (platform.type === 'alipay') {
    await storageExample()
    await locationExample()
    await cameraExample()
    await biometricExample()
    await notificationExample()
    await shareExample()
    
    // 运行状态管理和路由示例
    stateManagementExample()
    routerExample()
    
    // 运行综合登录示例
    await alipayLoginFlow()
  } else {
    console.log('当前不在支付宝小程序环境，跳过平台特定示例')
  }
  
  console.log('支付宝小程序示例初始化完成')
}

// 导出支付宝小程序特定功能
export {
  checkCurrentPlatform,
  storageExample,
  locationExample,
  cameraExample,
  biometricExample,
  notificationExample,
  shareExample,
  requestExample,
  stateManagementExample,
  routerExample,
  alipayLoginFlow
}