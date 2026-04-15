/**
 * VibeHub Template: Product Detail
 * 商品详情 - 轮播图 + 规格选择 + 悬浮购买栏
 * 
 * Usage: uniadapter template add product-detail
 */
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface ProductDetailProps {
  product?: {
    id: string
    name: string
    price: number
    originalPrice?: number
    description: string
    images: string[]
    specs: { name: string; options: string[] }[]
    shopName: string
    sales: number
  }
  onAddCart?: (id: string, count: number, spec: string) => void
  onBuyNow?: (id: string, count: number, spec: string) => void
}

const MOCK_PRODUCT = {
  id: '1',
  name: '云南高原新鲜蓝莓 125g×4盒 独立包装 产地直发',
  price: 59.9,
  originalPrice: 89.9,
  description: '源自云南高原海拔1800米生态种植园，果粉饱满，花青素含量高。每一颗蓝莓都经过人工精心挑选，确保粒粒饱满。冷链配送，新鲜到家。',
  images: [
    'https://picsum.photos/750/750?random=51',
    'https://picsum.photos/750/750?random=52',
    'https://picsum.photos/750/750?random=53',
  ],
  specs: [
    { name: '规格', options: ['125g×2盒', '125g×4盒', '125g×6盒'] },
    { name: '包装', options: ['普通装', '礼盒装+20元'] },
  ],
  shopName: '鲜生果园旗舰店',
  sales: 8923,
}

export function ProductDetailPage({ product = MOCK_PRODUCT, onAddCart, onBuyNow }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  const [count, setCount] = useState(1)

  const handleSpecSelect = (specName: string, option: string) => {
    setSelectedSpecs(prev => ({ ...prev, [specName]: option }))
  }

  const handleBuyNow = () => {
    const specStr = Object.values(selectedSpecs).join(' + ')
    onBuyNow?.(product.id, count, specStr)
  }

  const handleAddCart = () => {
    const specStr = Object.values(selectedSpecs).join(' + ')
    onAddCart?.(product.id, count, specStr)
  }

  return (
    <View className="product-detail">
      {/* Image Swiper */}
      <Swiper
        className="image-swiper"
        indicatorDots
        autoplay={false}
        onChange={e => setActiveImage(e.detail.current)}
      >
        {product.images.map((img, i) => (
          <SwiperItem key={i}>
            <Image className="detail-image" src={img} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>
      <View className="image-indicator">
        <Text>{activeImage + 1} / {product.images.length}</Text>
      </View>

      {/* Price Section */}
      <View className="price-section">
        <View className="price-row">
          <Text className="current-price">¥{product.price}</Text>
          {product.originalPrice && (
            <Text className="original-price">¥{product.originalPrice}</Text>
          )}
          <View className="discount-tag">
            <Text>限时特惠</Text>
          </View>
        </View>
        <Text className="sales-count">已售 {product.sales}</Text>
      </View>

      {/* Product Name */}
      <View className="name-section">
        <Text className="product-name">{product.name}</Text>
      </View>

      {/* Specs */}
      {product.specs.map(spec => (
        <View key={spec.name} className="spec-section">
          <Text className="spec-title">{spec.name}</Text>
          <View className="spec-options">
            {spec.options.map(option => {
              const isSelected = selectedSpecs[spec.name] === option
              const isDisabled = option.includes('+') && !selectedSpecs[spec.name]
              return (
                <View
                  key={option}
                  className={`spec-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && handleSpecSelect(spec.name, option)}
                >
                  <Text>{option}</Text>
                </View>
              )
            })}
          </View>
        </View>
      ))}

      {/* Description */}
      <View className="desc-section">
        <Text className="section-title">商品详情</Text>
        <Text className="description">{product.description}</Text>
      </View>

      {/* Bottom Spacer */}
      <View className="bottom-spacer" />

      {/* Fixed Bottom Bar */}
      <View className="bottom-bar">
        <View className="bottom-icons">
          <View className="icon-item">
            <Text className="icon-emoji">🏠</Text>
            <Text className="icon-label">首页</Text>
          </View>
          <View className="icon-item">
            <Text className="icon-emoji">⭐</Text>
            <Text className="icon-label">收藏</Text>
          </View>
          <View className="icon-item">
            <Text className="icon-emoji">🛒</Text>
            <Text className="icon-label">购物车</Text>
          </View>
        </View>
        <View className="bottom-buttons">
          <Button size="small" onClick={handleAddCart}>加入购物车</Button>
          <Button type="primary" size="small" onClick={handleBuyNow}>立即购买</Button>
        </View>
      </View>

      <style>{`
        .product-detail { padding-bottom: 70px; background: #f5f5f5; }
        .image-swiper { height: 375px; position: relative; }
        .detail-image { width: 100%; height: 375px; }
        .image-indicator { position: absolute; bottom: 12px; right: 16px; background: rgba(0,0,0,0.4); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 12px; }
        .price-section { background: #fff; padding: 16px; }
        .price-row { display: flex; align-items: baseline; gap: 8px; }
        .current-price { font-size: 24px; color: #ff4757; font-weight: 700; }
        .original-price { font-size: 14px; color: #bbb; text-decoration: line-through; }
        .discount-tag { background: #ff4757; color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 4px; }
        .sales-count { font-size: 13px; color: #999; margin-top: 4px; }
        .name-section { background: #fff; padding: 0 16px 16px; border-top: 1px solid #f5f5f5; }
        .product-name { font-size: 16px; color: #1a1a1a; line-height: 1.5; font-weight: 500; }
        .spec-section { background: #fff; padding: 16px; margin-top: 8px; }
        .spec-title { font-size: 14px; color: #333; font-weight: 500; margin-bottom: 12px; display: block; }
        .spec-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .spec-option { padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; color: #333; }
        .spec-option.selected { border-color: #07c160; color: #07c160; background: #e8f5e9; }
        .spec-option.disabled { opacity: 0.5; }
        .desc-section { background: #fff; padding: 16px; margin-top: 8px; }
        .section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; display: block; }
        .description { font-size: 14px; color: #666; line-height: 1.8; }
        .bottom-spacer { height: 70px; }
        .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; display: flex; align-items: center; padding: 8px 16px; box-shadow: 0 -2px 10px rgba(0,0,0,0.05); gap: 12px; }
        .bottom-icons { display: flex; gap: 16px; }
        .icon-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .icon-emoji { font-size: 20px; }
        .icon-label { font-size: 10px; color: #666; }
        .bottom-buttons { display: flex; flex: 1; gap: 8px; }
      `}</style>
    </View>
  )
}
