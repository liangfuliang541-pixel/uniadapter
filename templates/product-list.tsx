/**
 * VibeHub Template: Product List
 * 商品列表 - 瀑布流 + 筛选 + 下拉刷新
 * 
 * Usage: uniadapter template add product-list
 */
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  sales: number
  shopName: string
}

interface ProductListProps {
  products?: Product[]
  onProductClick?: (id: string) => void
  onSearch?: (keyword: string) => void
}

const SORT_OPTIONS = [
  { id: 'default', label: '综合' },
  { id: 'sales', label: '销量' },
  { id: 'price-asc', label: '价格↑' },
  { id: 'price-desc', label: '价格↓' },
]

const FILTER_OPTIONS = [
  { id: 'all', label: '全部' },
  { id: 'tmall', label: '天猫' },
  { id: 'self', label: '自营' },
  { id: 'fresh', label: '生鲜' },
]

const MOCK_PRODUCTS: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: [
    '韩版宽松百搭纯棉T恤 女装2024新款', '智能手表 运动防水 心率监测',
    '进口蓝莓125g*4盒 云南高原新鲜水果', '北欧风简约书桌 家用办公电脑桌',
    '日系复古相机 胶片风格 便携数码', '纯手工巧克力礼盒 送女友礼物'
  ][i % 6],
  price: +(Math.random() * 200 + 19).toFixed(1),
  originalPrice: Math.random() > 0.5 ? +(Math.random() * 200 + 99).toFixed(1) : undefined,
  image: `https://picsum.photos/300/${300 + (i % 3) * 50}?random=${i + 20}`,
  sales: Math.floor(Math.random() * 10000),
  shopName: ['优品汇', '数码工坊', '鲜生果园', '北欧家居'][i % 4],
}))

export function ProductListPage({ products = MOCK_PRODUCTS, onProductClick }: ProductListProps) {
  const [activeSort, setActiveSort] = useState('default')
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const leftProducts = products.filter((_, i) => i % 2 === 0)
  const rightProducts = products.filter((_, i) => i % 2 === 1)

  return (
    <View className="product-list-page">
      {/* Filter Bar */}
      <View className="filter-bar">
        {SORT_OPTIONS.map(opt => (
          <Text
            key={opt.id}
            className={`filter-tag ${activeSort === opt.id ? 'active' : ''}`}
            onClick={() => setActiveSort(opt.id)}
          >
            {opt.label}
          </Text>
        ))}
        <View className="filter-spacer" />
        <View className="filter-tabs" onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
          <Text className="filter-icon">{viewMode === 'grid' ? '▦' : '☰'}</Text>
          <Text className="filter-label">{viewMode === 'grid' ? '网格' : '列表'}</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView className="filter-chips" scrollX>
        {FILTER_OPTIONS.map(opt => (
          <View
            key={opt.id}
            className={`filter-chip ${activeFilter === opt.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(opt.id)}
          >
            <Text>{opt.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Product Grid (Waterfall) */}
      {viewMode === 'grid' ? (
        <ScrollView className="product-waterfall" scrollY onScrollToLower={() => {}}>
          <View className="waterfall-container">
            <View className="waterfall-column">
              {leftProducts.map(p => (
                <View key={p.id} className="waterfall-item" onClick={() => onProductClick?.(p.id)}>
                  <Image className="waterfall-img" src={p.image} mode="widthFix" />
                  <View className="waterfall-info">
                    <Text className="waterfall-name">{p.name}</Text>
                    <View className="waterfall-bottom">
                      <Text className="waterfall-price">¥{p.price}</Text>
                      <Text className="waterfall-sales">{p.sales}人付款</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View className="waterfall-column">
              {rightProducts.map(p => (
                <View key={p.id} className="waterfall-item" onClick={() => onProductClick?.(p.id)}>
                  <Image className="waterfall-img" src={p.image} mode="widthFix" />
                  <View className="waterfall-info">
                    <Text className="waterfall-name">{p.name}</Text>
                    <View className="waterfall-bottom">
                      <Text className="waterfall-price">¥{p.price}</Text>
                      <Text className="waterfall-sales">{p.sales}人付款</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        /* List View */
        <ScrollView className="product-list-view" scrollY onScrollToLower={() => {}}>
          {products.map(p => (
            <View key={p.id} className="list-item" onClick={() => onProductClick?.(p.id)}>
              <Image className="list-img" src={p.image} mode="aspectFill" />
              <View className="list-info">
                <Text className="list-name">{p.name}</Text>
                <Text className="list-shop">{p.shopName}</Text>
                <View className="list-bottom">
                  <Text className="list-price">¥{p.price}</Text>
                  {p.originalPrice && (
                    <Text className="list-original">¥{p.originalPrice}</Text>
                  )}
                  <Text className="list-sales">{p.sales}人付款</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <style>{`
        .product-list-page { height: 100vh; display: flex; flex-direction: column; background: #f5f5f5; }
        .filter-bar { display: flex; align-items: center; padding: 12px 16px; background: #fff; gap: 20px; border-bottom: 1px solid #f0f0f0; }
        .filter-tag { font-size: 14px; color: #666; }
        .filter-tag.active { color: #07c160; font-weight: 600; }
        .filter-spacer { flex: 1; }
        .filter-tabs { display: flex; align-items: center; gap: 4px; }
        .filter-icon { font-size: 14px; }
        .filter-label { font-size: 12px; color: #666; }
        .filter-chips { display: flex; padding: 10px 16px; background: #fff; gap: 8px; white-space: nowrap; }
        .filter-chip { padding: 4px 12px; border-radius: 14px; background: #f0f0f0; font-size: 12px; color: #666; }
        .filter-chip.active { background: #e8f5e9; color: #07c160; font-weight: 500; }
        .product-waterfall { flex: 1; }
        .waterfall-container { display: flex; padding: 8px; gap: 8px; }
        .waterfall-column { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .waterfall-item { background: #fff; border-radius: 8px; overflow: hidden; }
        .waterfall-img { width: 100%; background: #f0f0f0; }
        .waterfall-info { padding: 8px; }
        .waterfall-name { font-size: 13px; color: #1a1a1a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
        .waterfall-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
        .waterfall-price { font-size: 15px; color: #ff4757; font-weight: 600; }
        .waterfall-sales { font-size: 11px; color: #999; }
        .product-list-view { flex: 1; }
        .list-item { display: flex; gap: 12px; padding: 12px 16px; background: #fff; border-bottom: 1px solid #f5f5f5; }
        .list-img { width: 100px; height: 100px; border-radius: 8px; background: #f0f0f0; flex-shrink: 0; }
        .list-info { flex: 1; display: flex; flex-direction: column; }
        .list-name { font-size: 14px; color: #1a1a1a; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .list-shop { font-size: 12px; color: #999; margin-top: 4px; }
        .list-bottom { display: flex; align-items: center; gap: 8px; margin-top: auto; }
        .list-price { font-size: 16px; color: #ff4757; font-weight: 600; }
        .list-original { font-size: 12px; color: #bbb; text-decoration: line-through; }
        .list-sales { font-size: 12px; color: #999; margin-left: auto; }
      `}</style>
    </View>
  )
}
