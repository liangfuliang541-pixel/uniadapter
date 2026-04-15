/**
 * VibeHub Template: Search Page
 * 搜索页 - 搜索框 + 历史记录 + 热门搜索 + 结果
 * 
 * Usage: uniadapter template add search
 */
import { View, Text, Input, Image } from '@tarojs/components'
import { useState } from 'react'

interface SearchPageProps {
  onSearch?: (keyword: string) => void
  onProductClick?: (id: string) => void
}

const HOT_SEARCHES = ['蓝莓', 'T恤', '护肤品', '蓝牙耳机', '零食大礼包', '台灯', '连衣裙', '运动鞋']
const HISTORY = ['连衣裙', '蓝牙耳机', '水果']

const MOCK_RESULTS = Array.from({ length: 8 }, (_, i) => ({
  id: `${i}`,
  name: ['韩版宽松百搭纯棉T恤女装', '智能蓝牙耳机运动防水', '进口蓝莓125g×4盒'][i % 3],
  price: +(Math.random() * 200 + 29).toFixed(1),
  image: `https://picsum.photos/200/200?random=${i + 90}`,
  sales: Math.floor(Math.random() * 5000),
}))

export function SearchPage({ onSearch, onProductClick }: SearchPageProps) {
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState<'home' | 'results'>('home')
  const [results] = useState(MOCK_RESULTS)

  const handleSearch = (kw: string) => {
    if (!kw.trim()) return
    setKeyword(kw)
    setMode('results')
    onSearch?.(kw)
  }

  const clearHistory = () => {}

  return (
    <View className="search-page">
      {/* Search Bar */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索商品"
            value={keyword}
            onConfirm={e => handleSearch(e.detail.value)}
            onInput={e => setKeyword(e.detail.value)}
            focus
          />
        </View>
        <Text className="cancel-btn" onClick={() => setMode('home')}>取消</Text>
      </View>

      {mode === 'home' ? (
        <View className="search-home">
          {/* History */}
          {HISTORY.length > 0 && (
            <View className="section">
              <View className="section-header">
                <Text className="section-title">搜索历史</Text>
                <Text className="clear-btn" onClick={clearHistory}>🗑 清空</Text>
              </View>
              <View className="tag-list">
                {HISTORY.map(tag => (
                  <View
                    key={tag}
                    className="tag-item"
                    onClick={() => handleSearch(tag)}
                  >
                    <Text>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Hot Search */}
          <View className="section">
            <View className="section-header">
              <Text className="section-title">🔥 热搜榜</Text>
              <View className="switch-btn">
                <Text>换一换</Text>
              </View>
            </View>
            <View className="hot-list">
              {HOT_SEARCHES.map((tag, i) => (
                <View
                  key={tag}
                  className={`hot-item ${i < 3 ? 'top' : ''}`}
                  onClick={() => handleSearch(tag)}
                >
                  <Text className="hot-rank">{i + 1}</Text>
                  <Text className="hot-label">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Suggestions */}
          <View className="section">
            <View className="section-header">
              <Text className="section-title">猜你想搜</Text>
            </View>
            <View className="tag-list">
              {['连衣裙 夏', '蓝牙耳机 降噪', '零食大礼包 组合', 'T恤 男'].map(tag => (
                <View key={tag} className="tag-item suggestion" onClick={() => handleSearch(tag)}>
                  <Text>🔍 {tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        /* Results */
        <View className="results-page">
          {/* Results Count */}
          <View className="results-header">
            <Text className="results-count">找到 {results.length} 个相关商品</Text>
            <View className="results-sort">
              <Text className="sort-active">综合</Text>
              <Text className="sort-item">销量</Text>
              <Text className="sort-item">价格</Text>
            </View>
          </View>

          {/* Results Grid */}
          <View className="results-grid">
            {results.map(item => (
              <View
                key={item.id}
                className="result-item"
                onClick={() => onProductClick?.(item.id)}
              >
                <Image className="result-img" src={item.image} mode="aspectFill" />
                <Text className="result-name">{item.name}</Text>
                <View className="result-bottom">
                  <Text className="result-price">¥{item.price}</Text>
                  <Text className="result-sales">{item.sales}人买</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <style>{`
        .search-page { min-height: 100vh; background: #f5f5f5; }
        .search-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; }
        .search-input-wrap { flex: 1; display: flex; align-items: center; background: #f5f5f5; border-radius: 16px; padding: 6px 12px; gap: 8px; }
        .search-icon { font-size: 14px; }
        .search-input { flex: 1; font-size: 14px; }
        .cancel-btn { font-size: 14px; color: #666; white-space: nowrap; }
        .search-home { padding: 0; }
        .section { background: #fff; margin-bottom: 8px; padding: 14px 16px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .section-title { font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .clear-btn { font-size: 12px; color: #999; }
        .switch-btn { font-size: 12px; color: #07c160; }
        .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-item { padding: 5px 12px; background: #f5f5f5; border-radius: 14px; font-size: 13px; color: #333; }
        .tag-item.suggestion { background: #f0f7f2; color: #07c160; }
        .hot-list { display: flex; flex-direction: column; gap: 10px; }
        .hot-item { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
        .hot-item.top .hot-rank { color: #ff4757; }
        .hot-rank { width: 16px; text-align: center; font-size: 14px; font-weight: 600; color: #999; }
        .hot-label { font-size: 14px; color: #1a1a1a; }
        .results-page { padding: 0; }
        .results-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; }
        .results-count { font-size: 13px; color: #999; }
        .results-sort { display: flex; gap: 16px; }
        .sort-active { font-size: 14px; color: #07c160; font-weight: 600; }
        .sort-item { font-size: 14px; color: #666; }
        .results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; padding: 2px; background: #f5f5f5; }
        .result-item { background: #fff; padding-bottom: 8px; }
        .result-img { width: 100%; height: 160px; background: #f0f0f0; }
        .result-name { font-size: 13px; color: #1a1a1a; padding: 6px 8px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
        .result-bottom { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px 0; }
        .result-price { font-size: 15px; color: #ff4757; font-weight: 600; }
        .result-sales { font-size: 11px; color: #999; }
      `}</style>
    </View>
  )
}
