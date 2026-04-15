/**
 * VibeHub Template: User Profile
 * 个人中心 - 头像 + 订单入口 + 功能菜单
 * 
 * Usage: uniadapter template add profile
 */
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'

interface MenuItem {
  icon: string
  title: string
  badge?: string
  arrow?: boolean
}

interface ProfilePageProps {
  user?: { name: string; avatar: string; level: string }
  onMenuClick?: (id: string) => void
}

const ORDER_MENUS = [
  { icon: '💰', title: '待付款', id: 'unpaid' },
  { icon: '📦', title: '待发货', id: 'unshipped' },
  { icon: '🚚', title: '待收货', id: 'shipped' },
  { icon: '⭐', title: '待评价', id: 'unrated' },
  { icon: '🔄', title: '退款/售后', id: 'refund' },
]

const GENERAL_MENUS: MenuItem[] = [
  { icon: '📍', title: '收货地址管理', arrow: true },
  { icon: '💳', title: '支付方式', arrow: true },
  { icon: '🎁', title: '优惠券', badge: '3', arrow: true },
  { icon: '❤️', title: '我的收藏', arrow: true },
  { icon: '🕐', title: '浏览历史', arrow: true },
  { icon: '⚙️', title: '设置', arrow: true },
]

export function ProfilePage({ user, onMenuClick }: ProfilePageProps) {
  const displayUser = user || { name: 'VibeUser', avatar: 'https://picsum.photos/200/200?random=100', level: 'Vibe会员' }

  return (
    <View className="profile-page">
      {/* Header */}
      <View className="profile-header">
        <View className="header-bg" />
        <View className="user-info">
          <Image className="avatar" src={displayUser.avatar} mode="aspectFill" />
          <View className="user-text">
            <Text className="user-name">{displayUser.name}</Text>
            <View className="user-level">
              <Text className="level-badge">{displayUser.level}</Text>
            </View>
          </View>
          <Button size="small" plain className="edit-btn">编辑资料</Button>
        </View>
      </View>

      {/* Wallet Summary */}
      <View className="wallet-card">
        <View className="wallet-item">
          <Text className="wallet-num">¥128.50</Text>
          <Text className="wallet-label">余额</Text>
        </View>
        <View className="wallet-divider" />
        <View className="wallet-item">
          <Text className="wallet-num">520</Text>
          <Text className="wallet-label">积分</Text>
        </View>
        <View className="wallet-divider" />
        <View className="wallet-item">
          <Text className="wallet-num">88</Text>
          <Text className="wallet-label">优惠券</Text>
        </View>
        <View className="wallet-divider" />
        <View className="wallet-item">
          <Text className="wallet-num">¥20.00</Text>
          <Text className="wallet-label">红包</Text>
        </View>
      </View>

      {/* Order Section */}
      <View className="section-card">
        <View className="section-header" onClick={() => onMenuClick?.('all-orders')}>
          <Text className="section-title">我的订单</Text>
          <View className="section-more">
            <Text className="more-text">全部订单</Text>
            <Text className="more-arrow">›</Text>
          </View>
        </View>
        <View className="order-menus">
          {ORDER_MENUS.map(menu => (
            <View key={menu.id} className="order-menu-item" onClick={() => onMenuClick?.(menu.id)}>
              <View className="order-icon-wrap">
                <Text className="order-icon">{menu.icon}</Text>
              </View>
              <Text className="order-label">{menu.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* General Menus */}
      <View className="section-card">
        <View className="menu-list">
          {GENERAL_MENUS.map((menu, i) => (
            <View
              key={menu.title}
              className={`menu-item ${i < GENERAL_MENUS.length - 1 ? 'bordered' : ''}`}
              onClick={() => onMenuClick?.(menu.title)}
            >
              <Text className="menu-icon">{menu.icon}</Text>
              <Text className="menu-title">{menu.title}</Text>
              {menu.badge && <View className="menu-badge"><Text>{menu.badge}</Text></View>}
              {menu.arrow && <Text className="menu-arrow">›</Text>}
            </View>
          ))}
        </View>
      </View>

      <style>{`
        .profile-page { min-height: 100vh; background: #f5f5f5; padding-bottom: 20px; }
        .profile-header { position: relative; background: linear-gradient(135deg, #07c160, #10b981); padding: 32px 16px 24px; }
        .header-bg { position: absolute; top: 0; left: 0; right: 0; height: 80px; background: rgba(255,255,255,0.1); border-radius: 0 0 24px 24px; }
        .user-info { display: flex; align-items: center; gap: 16px; position: relative; z-index: 1; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); }
        .user-text { flex: 1; }
        .user-name { display: block; font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .user-level { display: flex; }
        .level-badge { background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px; }
        .edit-btn { background: rgba(255,255,255,0.2); border: none; color: #fff; font-size: 12px; }
        .wallet-card { display: flex; background: #fff; margin: 12px; border-radius: 12px; padding: 16px 8px; }
        .wallet-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .wallet-num { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .wallet-label { font-size: 12px; color: #999; }
        .wallet-divider { width: 1px; background: #f0f0f0; margin: 4px 0; }
        .section-card { background: #fff; margin: 0 12px 12px; border-radius: 12px; overflow: hidden; }
        .section-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f5f5f5; }
        .section-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .section-more { display: flex; align-items: center; gap: 4px; }
        .more-text { font-size: 13px; color: #999; }
        .more-arrow { color: #bbb; font-size: 14px; }
        .order-menus { display: flex; padding: 16px 8px; }
        .order-menu-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .order-icon-wrap { font-size: 24px; }
        .order-label { font-size: 12px; color: #333; }
        .menu-list { padding: 0 16px; }
        .menu-item { display: flex; align-items: center; padding: 14px 0; gap: 12px; }
        .menu-item.bordered { border-bottom: 1px solid #f5f5f5; }
        .menu-icon { font-size: 18px; }
        .menu-title { flex: 1; font-size: 15px; color: #1a1a1a; }
        .menu-badge { background: #ff4757; color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 10px; }
        .menu-arrow { color: #bbb; font-size: 16px; }
      `}</style>
    </View>
  )
}
