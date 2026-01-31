/**
 * ============================================
 * 心迹移动版 - 入口文件
 * ============================================
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, PermissionsAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

// 页面组件导入
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import JournalPage from './pages/JournalPage'
import InsightsPage from './pages/InsightsPage'
import SettingsPage from './pages/SettingsPage'

// 初始化平台功能
const initializeApp = async () => {
  // 请求必要权限
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ])
  }
  
  // 配置通知
  // notifications.configure(handleNotification)
}

// 底部导航配置
const Tab = createBottomTabNavigator()

export default function App() {
  React.useEffect(() => {
    initializeApp()
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string

            switch (route.name) {
              case '首页':
                iconName = 'home'
                break
              case '日历':
                iconName = 'calendar-today'
                break
              case '日记':
                iconName = 'book'
                break
              case '洞察':
                iconName = 'insights'
                break
              case '设置':
                iconName = 'settings'
                break
              default:
                iconName = 'circle'
            }

            return <Icon name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="首页" component={HomePage} />
        <Tab.Screen name="日历" component={CalendarPage} />
        <Tab.Screen name="日记" component={JournalPage} />
        <Tab.Screen name="洞察" component={InsightsPage} />
        <Tab.Screen name="设置" component={SettingsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}