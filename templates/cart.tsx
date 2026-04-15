/**
 * VibeHub Template: Shopping Cart
 * 购物车 - 多选结算 + 数量编辑 + 删除
 * 
 * Usage: uniadapter template add cart
 */
import { View, Text, Image, Checkbox } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface CartItem {
  id: string
  name: string
  spec: string
  price: number
  image: string
  count: number
  shopName: string
}

interface CartPageProps {
  items?: CartItem[]
  onCheckout?: (ids: string[]) => void
  onDelete?: (ids: string[]) => void
}

const MOCK_ITEMS: CartItem[] = [
  { id: '1', name: '云南高原新鲜蓝莓125g×4盒', spec: '125g×4盒 / 普通装', price: 59.9, image: 'https://picsum.photos/200/200?random=71', count: 2, shopName: '鲜生果园' },
  { id: '2', name: '日本直邮 SK-II 护肤精华露 75ml', spec: '75ml', price: 899, image: 'https://picsum.photos/200/200?random=72', count: 1, shopName: '美妆全球购' },
  { id: '3', name: '北欧风简约台灯 护眼学习灯', spec: '白色', price: 129, image: 'https://picsum.photos/200/200?random=73', count: 1, shopName: '北欧家居' },
]

export function CartPage({ items = MOCK_ITEMS, onCheckout, onDelete }: CartPageProps) {
  const [data, setData] = useState(items)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editMode, setEditMode] = useState(false)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(data.map(i => i.id)))
    }
  }

  const updateCount = (id: string, delta: number) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, count: Math.max(1, item.count + delta) } : item
    ))
  }

  const total = data.filter(i => selected.has(i.id)).reduce((sum, i) => sum + i.price * i.count, 0)
  const selectedCount = selected.size

  const handleDelete = () => {
    const ids = Array.from(selected)
    setData(prev => prev.filter(i => !selected.has(i.id)))
    setSelected(new Set())
    onDelete?.(ids)
  }

  return (
    <View className="cart-page">
      {/* Header */}
      <View className="cart-header">
        <Text className="cart-title">购物车</Text>
        <Text className="edit-btn" onClick={() => setEditMode(m => !m)}>
          {editMode ? '完成' : '编辑'}
        </Text>
      </View>

      {/* Items */}
      {data.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-emoji">🛒</Text>
          <Text className="empty-text">购物车是空的</Text>
          <Button size="small" onClick={() => {}}>去逛逛</Button>
        </View>
      ) : (
        <View className="cart-list">
          {data.map(item => (
            <View key={item.id} className="cart-item">
              <Checkbox
                className="item-checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
              <Image className="item-img" src={item.image} mode="aspectFill" />
              <View className="item-info">
                <Text className="item-name">{item.name}</Text>
                <Text className="item-spec">{item.spec}</Text>
                <View className="item-bottom">
                  <Text className="item-price">¥{item.price}</Text>
                  <View className="count-ctrl">
                    <View className="count-btn" onClick={() => updateCount(item.id, -1)}>
                      <Text>−</Text>
                    </View>
                    <Text className="count-num">{item.count}</Text>
                    <View className="count-btn" onClick={() => updateCount(item.id, 1)}>
                      <Text>+</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Bottom Bar */}
      <View className="cart-bottom">
        <View className="select-all" onClick={toggleAll}>
          <Checkbox checked={selected.size === data.length && data.length > 0} />
          <Text className="select-label">全选</Text>
        </View>
        {editMode ? (
          <Button
            type="warn"
            size="small"
            disabled={selectedCount === 0}
            onClick={handleDelete}
          >
            删除 ({selectedCount})
          </Button>
        ) : (
          <View className="checkout-area">
            <View className="total-info">
              <Text className="total-label">合计：</Text>
              <Text className="total-price">¥{total.toFixed(2)}</Text>
            </View>
            <Button
              type="primary"
              size="small"
              disabled={selectedCount === 0}
              onClick={() => onCheckout?.(Array.from(selected))}
            >
              结算 ({selectedCount})
            </Button>
          </View>
        )}
      </View>

      <style>{`
        .cart-page { height: 100vh; display: flex; flex-direction: column; background: #f5f5f5; }
        .cart-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #fff; }
        .cart-title { font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .edit-btn { font-size: 14px; color: #07c160; }
        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .empty-emoji { font-size: 64px; }
        .empty-text { font-size: 16px; color: #999; }
        .cart-list { flex: 1; overflow-y: auto; padding-bottom: 60px; }
        .cart-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; margin-bottom: 2px; }
        .item-checkbox { transform: scale(0.8); }
        .item-img { width: 80px; height: 80px; border-radius: 6px; background: #f0f0f0; flex-shrink: 0; }
        .item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .item-name { font-size: 14px; color: #1a1a1a; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .item-spec { font-size: 12px; color: #999; }
        .item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .item-price { font-size: 15px; color: #ff4757; font-weight: 600; }
        .count-ctrl { display: flex; align-items: center; gap: 0; border: 1px solid #eee; border-radius: 4px; }
        .count-btn { width: 28px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #666; }
        .count-num { width: 32px; text-align: center; font-size: 14px; border-left: 1px solid #eee; border-right: 1px solid #eee; line-height: 24px; }
        .cart-bottom { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; box-shadow: 0 -2px 8px rgba(0,0,0,0.05); }
        .select-all { display: flex; align-items: center; gap: 6px; }
        .select-label { font-size: 14px; color: #333; }
        .checkout-area { display: flex; align-items: center; gap: 12px; }
        .total-info { display: flex; align-items: baseline; gap: 4px; }
        .total-label { font-size: 13px; color: #666; }
        .total-price { font-size: 18px; color: #ff4757; font-weight: 700; }
      `}</style>
    </View>
  )
}
