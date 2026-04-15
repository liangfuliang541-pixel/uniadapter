/**
 * VibeHub Template: Home Page
 * 首页 - Banner + 分类入口 + 商品推荐
 * 
 * Usage: uniadapter template add home
 */
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface ProductItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  tag?: string
}

interface HomePageProps {
  onSearch?: () => void
  onProductClick?: (id: string) => void
  onCategoryClick?: (id: string) => void
}

const BANNERS = [
  { id: '1', image: 'https://picsum.photos/750/400?random=1', url: '' },
  { id: '2', image: 'https://picsum.photos/750/400?random=2', url: '' },
  { id: '3', image: 'https://picsum.photos/750/400?random=3', url: '' },
]

const CATEGORIES = [
  { id: '1', name: '生鲜', icon: '🥬', color: '#4caf50' },
  { id: '2', name: '水果', icon: '🍎', color: '#ff5722' },
  { id: '3', name: '零食', icon: '🍪', color: '#ff9800' },
  { id: '4', name: '美妆', icon: '💄', color: '#e91e63' },
  { id: '5', name: '家居', icon: '🏠', color: '#795548' },
  { id: '6', name: '数码', icon: '📱', color: '#2196f3' },
  { id: '7', name: '服饰', icon: '👗', color: '#9c27b0' },
  { id: '8', name: '更多', icon: '•••', color: '#607d8b' },
]

const PRODUCTS: ProductItem[] = [
  { id: '1', name: '云南高原新鲜蓝莓125g*4盒', price: 59.9, originalPrice: 89.9, image: 'https://picsum.photos/300/300?random=11', tag: '秒杀' },
  { id: '2', name: '泰国进口金枕榴莲肉 300g', price: 39.9, image: 'https://picsum.photos/300/300?random=12', tag: '热卖' },
  { id: '3', name: '日本直邮 SK-II 护肤精华露', price: 899, originalPrice: 1199, image: 'https://picsum.photos/300/300?random=13', tag: '特惠' },
  { id: '4', name: '北欧风简约台灯 护眼学习灯', price: 129, image: 'https://picsum.photos/300/300?random=14' },
  { id: '5', name: '纯棉宽松T恤 男士休闲百搭', price: 79, originalPrice: 159, image: 'https://picsum.photos/300/300?random=15', tag: '清仓' },
  { id: '6', name: '有机土鸡蛋 30枚 农家散养', price: 45.9, image: 'https://picsum.photos/300/300?random=16' },
]

export function HomePage({ onSearch, onProductClick, onCategoryClick }: HomePageProps) {
  const [activeBanner, setActiveBanner] = useState(0)

  return (
    <ScrollView className="home-page" scrollY onScrollToLower={() => {}}>
      {/* Search Bar */}
      <View className="search-bar" onClick={onSearch}>
        <View className="search-input">
          <Text className="search-icon">🔍</Text>
          <Text className="search-placeholder">搜索商品、品牌</Text>
        </View>
      </View>

      {/* Banner */}
      <Swiper
        className="banner"
        indicatorDots
        autoplay
        interval={3000}
        circular
        onChange={e => setActiveBanner(e.detail.current)}
      >
        {BANNERS.map(banner => (
          <SwiperItem key={banner.id}>
            <Image className="banner-img" src={banner.image} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      {/* Categories */}
      <View className="categories">
        {CATEGORIES.map(cat => (
          <View
            key={cat.id}
            className="category-item"
            onClick={() => onCategoryClick?.(cat.id)}
          >
            <View className="category-icon" style={{ background: cat.color }}>
              <Text>{cat.icon}</Text>
            </View>
            <Text className="category-name">{cat.name}</Text>
          </View>
        ))}
      </View>

      {/* Flash Sale */}
      <View className="section">
        <View className="section-header">
          <View className="section-title-group">
            <Text className="section-title">🔥 限时秒杀</Text>
            <View className="countdown">
              <Text className="countdown-num">02</Text>
              <Text className="countdown-sep">:</Text>
              <Text className="countdown-num">34</Text>
              <Text className="countdown-sep">:</Text>
              <Text className="countdown-num">56</Text>
            </View>
          </View>
          <View className="section-more">
            <Text>更多</Text>
            <Text>›</Text>
          </View>
        </View>
        <ScrollView className="product-scroll" scrollX>
          {PRODUCTS.slice(0, 4).map(p => (
            <View
              key={p.id}
              className="product-card"
              onClick={() => onProductClick?.(p.id)}
            >
              <Image className="product-img" src={p.image} mode="aspectFill" />
              {p.tag && <View className="product-tag"><Text>{p.tag}</Text></View>}
              <View className="product-info">
                <Text className="product-name">{p.name}</Text>
                <View className="product-price-row">
                  <Text className="product-price">¥{p.price}</Text>
                  {p.originalPrice && (
                    <Text className="product-original-price">¥{p.originalPrice}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recommended */}
      <View className="section">
        <View className="section-header">
          <Text className="section-title">📌 为你推荐</Text>
          <View className="section-more">
            <Text>更多</Text>
            <Text>›</Text>
          </View>
        </View>
        <View className="product-grid">
          {PRODUCTS.map(p => (
            <View
              key={p.id}
              className="product-grid-item"
              onClick={() => onProductClick?.(p.id)}
            >
              <Image className="product-grid-img" src={p.image} mode="aspectFill" />
              {p.tag && <View className="product-tag"><Text>{p.tag}</Text></View>}
              <View className="product-grid-info">
                <Text className="product-grid-name">{p.name}</Text>
                <View className="product-price-row">
                  <Text className="product-price">¥{p.price}</Text>
                  {p.originalPrice && (
                    <Text className="product-original-price">¥{p.originalPrice}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <style>{`
        .home-page { height: 100vh; background: #f5f5f5; }
        .search-bar { padding: 12px 16px; background: #07c160; }
        .search-input { display: flex; align-items: center; background: #fff; border-radius: 8px; padding: 8px 12px; gap: 8px; }
        .search-icon { font-size: 14px; }
        .search-placeholder { font-size: 14px; color: #999; }
        .banner { height: 180px; }
        .banner-img { width: 100%; height: 180px; }
        .categories { display: grid; grid-template-columns: repeat(4, 1fr); padding: 16px; gap: 12px; background: #fff; }
        .category-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .category-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .category-name { font-size: 12px; color: #333; }
        .section { background: #fff; margin-top: 8px; padding: 16px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .section-title-group { display: flex; align-items: center; gap: 8px; }
        .section-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .countdown { display: flex; align-items: center; gap: 2px; }
        .countdown-num { background: #07c160; color: #fff; font-size: 12px; padding: 2px 4px; border-radius: 3px; font-weight: 600; }
        .countdown-sep { color: #07c160; font-weight: 600; margin: 0 1px; }
        .section-more { display: flex; align-items: center; gap: 2px; font-size: 13px; color: #999; }
        .product-scroll { display: flex; gap: 10px; }
        .product-card { width: 120px; flex-shrink: 0; }
        .product-img { width: 120px; height: 120px; border-radius: 8px; background: #f0f0f0; position: relative; }
        .product-tag { position: absolute; top: 0; left: 0; background: #ff4757; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 8px 0 8px 0; }
        .product-info { padding: 8px 0; }
        .product-name { font-size: 13px; color: #1a1a1a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
        .product-price-row { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .product-price { font-size: 15px; color: #ff4757; font-weight: 600; }
        .product-original-price { font-size: 11px; color: #bbb; text-decoration: line-through; }
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .product-grid-item { background: #fff; border-radius: 8px; overflow: hidden; }
        .product-grid-img { width: 100%; height: 160px; background: #f0f0f0; position: relative; }
        .product-grid-info { padding: 8px; }
        .product-grid-name { font-size: 13px; color: #1a1a1a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </ScrollView>
  )
}
