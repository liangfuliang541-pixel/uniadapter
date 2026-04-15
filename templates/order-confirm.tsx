/**
 * VibeHub Template: Order Confirmation
 * 订单确认 - 地址 + 支付 + 优惠券 + 价格明细
 * 
 * Usage: uniadapter template add order-confirm
 */
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface OrderConfirmProps {
  items?: { name: string; price: number; count: number; image: string; spec: string }[]
  onSubmit?: (payment: string) => void
}

const PAYMENT_METHODS = [
  { id: 'wechat', label: '微信支付', icon: '🟢', desc: '推荐' },
  { id: 'alipay', label: '支付宝', icon: '🔵' },
  { id: 'balance', label: '余额支付 (¥128.50)', icon: '💰' },
]

const COUPONS = [
  { id: '1', value: 10, condition: '满99可用', selected: false },
  { id: '2', value: 30, condition: '满299可用', selected: true },
  { id: '3', value: 5, condition: '无门槛', selected: false, disabled: true },
]

export function OrderConfirmPage({ items, onSubmit }: OrderConfirmProps) {
  const [payment, setPayment] = useState('wechat')
  const [couponIdx, setCouponIdx] = useState(1)
  const [memo, setMemo] = useState('')

  const orderItems = items || [
    { name: '云南高原新鲜蓝莓125g×4盒', price: 59.9, count: 2, image: 'https://picsum.photos/200/200?random=81', spec: '125g×4盒' },
    { name: '日本直邮 SK-II 护肤精华露 75ml', price: 899, count: 1, image: 'https://picsum.photos/200/200?random=82', spec: '75ml' },
  ]

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.count, 0)
  const discount = COUPONS[couponIdx]?.value || 0
  const freight = subtotal >= 99 ? 0 : 10
  const total = subtotal - discount + freight

  return (
    <View className="order-confirm">
      {/* Address */}
      <View className="address-card">
        <View className="address-icon">📍</View>
        <View className="address-info">
          <View className="address-top">
            <Text className="receiver-name">张三</Text>
            <Text className="receiver-phone">138****8888</Text>
          </View>
          <Text className="receiver-addr">广东省深圳市南山区科技园南区高新南七道R2-B栋5楼</Text>
        </View>
        <Text className="addr-arrow">›</Text>
      </View>

      {/* Items */}
      <View className="section">
        <View className="section-title">商品信息</View>
        {orderItems.map((item, i) => (
          <View key={i} className="order-item">
            <Image className="order-img" src={item.image} mode="aspectFill" />
            <View className="order-info">
              <Text className="order-name">{item.name}</Text>
              <Text className="order-spec">{item.spec}</Text>
              <View className="order-bottom">
                <Text className="order-price">¥{item.price}</Text>
                <Text className="order-count">×{item.count}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Payment */}
      <View className="section">
        <View className="section-title">支付方式</View>
        {PAYMENT_METHODS.map(method => (
          <View
            key={method.id}
            className={`payment-item ${payment === method.id ? 'selected' : ''}`}
            onClick={() => setPayment(method.id)}
          >
            <Text className="payment-icon">{method.icon}</Text>
            <Text className="payment-label">{method.label}</Text>
            {method.desc && <View className="payment-badge"><Text>{method.desc}</Text></View>}
            <View className={`payment-radio ${payment === method.id ? 'on' : ''}`} />
          </View>
        ))}
      </View>

      {/* Coupon */}
      <View className="section">
        <View className="row-item" onClick={() => {}}>
          <Text className="row-label">优惠券</Text>
          <View className="row-value">
            <Text className="coupon-value">-{discount}元</Text>
            <Text className="row-arrow">›</Text>
          </View>
        </View>
        <View className="row-item">
          <Text className="row-label">配送方式</Text>
          <View className="row-value">
            <Text className="row-text">{freight === 0 ? '免运费 (满99元)' : `普通快递 ¥${freight}`}</Text>
          </View>
        </View>
        <View className="row-item">
          <Text className="row-label">订单备注</Text>
          <input
            className="memo-input"
            placeholder="选填，可备注特殊需求"
            value={memo}
            onInput={e => setMemo(e.detail.value)}
          />
        </View>
      </View>

      {/* Price Summary */}
      <View className="section price-summary">
        <View className="price-row">
          <Text className="price-label">商品总价</Text>
          <Text className="price-value">¥{subtotal.toFixed(2)}</Text>
        </View>
        <View className="price-row">
          <Text className="price-label">运费</Text>
          <Text className="price-value">{freight === 0 ? '免' : `¥${freight}`}</Text>
        </View>
        <View className="price-row">
          <Text className="price-label">优惠</Text>
          <Text className="price-value discount">-¥{discount.toFixed(2)}</Text>
        </View>
        <View className="price-row total-row">
          <Text className="total-label">合计</Text>
          <Text className="total-value">¥{total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="bottom-bar">
        <View className="bottom-total">
          <Text className="bottom-label">实付</Text>
          <Text className="bottom-price">¥{total.toFixed(2)}</Text>
        </View>
        <Button type="primary" onClick={() => onSubmit?.(payment)}>
          提交订单
        </Button>
      </View>

      <style>{`
        .order-confirm { padding-bottom: 70px; background: #f5f5f5; }
        .address-card { display: flex; align-items: center; gap: 12px; background: #fff; padding: 16px; margin-bottom: 8px; }
        .address-icon { font-size: 24px; }
        .address-info { flex: 1; }
        .address-top { display: flex; gap: 12px; margin-bottom: 6px; }
        .receiver-name { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .receiver-phone { font-size: 14px; color: #666; }
        .receiver-addr { font-size: 13px; color: #666; line-height: 1.5; }
        .addr-arrow { color: #bbb; font-size: 18px; }
        .section { background: #fff; margin-bottom: 8px; padding: 0 16px; }
        .section-title { font-size: 14px; font-weight: 600; color: #333; padding: 14px 0 10px; border-bottom: 1px solid #f5f5f5; }
        .order-item { display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
        .order-img { width: 60px; height: 60px; border-radius: 6px; background: #f0f0f0; flex-shrink: 0; }
        .order-info { flex: 1; }
        .order-name { font-size: 14px; color: #1a1a1a; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .order-spec { font-size: 12px; color: #999; margin-top: 2px; }
        .order-bottom { display: flex; justify-content: space-between; margin-top: 4px; }
        .order-price { font-size: 14px; color: #ff4757; font-weight: 500; }
        .order-count { font-size: 13px; color: #999; }
        .payment-item { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
        .payment-item:last-child { border-bottom: none; }
        .payment-icon { font-size: 20px; }
        .payment-label { flex: 1; font-size: 14px; color: #1a1a1a; }
        .payment-badge { background: #ff4757; color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 3px; }
        .payment-radio { width: 18px; height: 18px; border: 2px solid #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .payment-radio.on { border-color: #07c160; }
        .payment-radio.on::after { content: ''; width: 10px; height: 10px; background: #07c160; border-radius: 50%; }
        .row-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #f5f5f5; }
        .row-item:last-child { border-bottom: none; }
        .row-label { font-size: 14px; color: #333; }
        .row-value { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
        .coupon-value { color: #ff4757; font-size: 14px; font-weight: 500; }
        .row-text { font-size: 14px; color: #666; }
        .row-arrow { color: #bbb; font-size: 16px; }
        .memo-input { flex: 1; text-align: right; font-size: 14px; color: #666; }
        .price-summary { padding: 12px 0; }
        .price-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .price-label { font-size: 13px; color: #666; }
        .price-value { font-size: 13px; color: #333; }
        .price-value.discount { color: #ff4757; }
        .total-row { margin-top: 8px; padding-top: 8px; border-top: 1px solid #f5f5f5; }
        .total-label { font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .total-value { font-size: 18px; font-weight: 700; color: #ff4757; }
        .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; display: flex; align-items: center; padding: 10px 16px; box-shadow: 0 -2px 8px rgba(0,0,0,0.05); gap: 12px; }
        .bottom-total { flex: 1; display: flex; align-items: baseline; gap: 4px; }
        .bottom-label { font-size: 13px; color: #666; }
        .bottom-price { font-size: 20px; font-weight: 700; color: #ff4757; }
      `}</style>
    </View>
  )
}
