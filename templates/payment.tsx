/**
 * VibeHub Template: Payment Integration
 * 支付集成模板 - 支持多种支付方式和订单处理
 *
 * Usage: uniadapter template add payment
 */
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  fee?: number
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface PaymentPageProps {
  orderItems: OrderItem[]
  shippingFee?: number
  discount?: number
  onPaymentSuccess?: (paymentMethod: string, orderId: string) => void
  onPaymentCancel?: () => void
}

export function PaymentPage({
  orderItems,
  shippingFee = 0,
  discount = 0,
  onPaymentSuccess,
  onPaymentCancel
}: PaymentPageProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // 支付方式配置
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wechat',
      name: '微信支付',
      icon: '💰',
      description: '推荐使用，安全快捷',
      fee: 0
    },
    {
      id: 'alipay',
      name: '支付宝',
      icon: '💳',
      description: '支持花呗、余额宝',
      fee: 0
    },
    {
      id: 'card',
      name: '银行卡',
      icon: '🏦',
      description: '支持各大银行',
      fee: 0
    },
    {
      id: 'cod',
      name: '货到付款',
      icon: '🚚',
      description: '送货上门后付款',
      fee: 5
    }
  ]

  // 计算订单总价
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingFee - discount

  // 选择支付方式
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  // 支付处理
  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      console.warn('请选择支付方式')
      return
    }

    if (!agreed) {
      console.warn('请同意支付协议')
      return
    }

    setLoading(true)
    try {
      // 模拟支付请求
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 这里应该调用实际的支付接口
      await new Promise(resolve => setTimeout(resolve, 2000))

      onPaymentSuccess?.(selectedPaymentMethod, orderId)
    } catch (error) {
      console.error('支付失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod)

  return (
    <View className="payment-page">
      {/* 订单信息 */}
      <View className="order-section">
        <View className="section-header">
          <Text className="section-title">订单信息</Text>
        </View>

        <View className="order-items">
          {orderItems.map(item => (
            <View key={item.id} className="order-item">
              <View className="item-info">
                <Text className="item-name">{item.name}</Text>
                <Text className="item-quantity">x{item.quantity}</Text>
              </View>
              <Text className="item-price">¥{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View className="order-summary">
          <View className="summary-row">
            <Text>商品小计</Text>
            <Text>¥{subtotal.toFixed(2)}</Text>
          </View>
          {shippingFee > 0 && (
            <View className="summary-row">
              <Text>运费</Text>
              <Text>¥{shippingFee.toFixed(2)}</Text>
            </View>
          )}
          {discount > 0 && (
            <View className="summary-row discount">
              <Text>优惠</Text>
              <Text>-¥{discount.toFixed(2)}</Text>
            </View>
          )}
          <View className="summary-row total">
            <Text>总计</Text>
            <Text>¥{total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 支付方式选择 */}
      <View className="payment-section">
        <View className="section-header">
          <Text className="section-title">选择支付方式</Text>
        </View>

        <View className="payment-methods">
          {paymentMethods.map(method => (
            <View
              key={method.id}
              className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <View className="method-info">
                <Text className="method-icon">{method.icon}</Text>
                <View className="method-details">
                  <Text className="method-name">{method.name}</Text>
                  <Text className="method-description">{method.description}</Text>
                </View>
              </View>
              <View className="method-fee">
                {method.fee ? (
                  <Text className="fee-text">+¥{method.fee}</Text>
                ) : (
                  <Text className="free-text">免费</Text>
                )}
              </View>
              {selectedPaymentMethod === method.id && (
                <View className="selected-indicator">✓</View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 支付协议 */}
      <View className="agreement-section">
        <View className="agreement-checkbox">
          <View
            className={`checkbox ${agreed ? 'checked' : ''}`}
            onClick={() => setAgreed(!agreed)}
          >
            {agreed && <Text className="checkmark">✓</Text>}
          </View>
          <Text className="agreement-text">
            我已阅读并同意
            <Text className="agreement-link">《支付服务协议》</Text>
            和
            <Text className="agreement-link">《隐私政策》</Text>
          </Text>
        </View>
      </View>

      {/* 支付按钮 */}
      <View className="payment-actions">
        <Button
          className="cancel-btn"
          onClick={onPaymentCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button
          className="pay-btn"
          onClick={handlePayment}
          loading={loading}
          disabled={loading || !selectedPaymentMethod || !agreed}
        >
          {selectedMethod?.fee ?
            `支付 ¥${(total + selectedMethod.fee).toFixed(2)}` :
            `支付 ¥${total.toFixed(2)}`
          }
        </Button>
      </View>
    </View>
  )
}