/**
 * ============================================
 * 心迹 XinJi - 反馈历史页面
 * ============================================
 * 
 * 展示用户提交的反馈历史记录
 * 用户可以查看之前的反馈内容和状态
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Star, Bug, Heart, Sparkles, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * 反馈记录接口
 */
interface FeedbackRecord {
  id: string;
  type: 'suggestion' | 'bug' | 'compliment' | 'feature' | 'other';
  rating: number | null;
  message: string;
  email?: string;
  isAnonymous: boolean;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'awful' | null;
  timestamp: number;
}

/**
 * 反馈类型配置
 */
const FEEDBACK_TYPE_CONFIG = {
  suggestion: { label: '建议', icon: Sparkles, color: 'text-blue-500' },
  bug: { label: '问题', icon: Bug, color: 'text-red-500' },
  compliment: { label: '夸奖', icon: Heart, color: 'text-pink-500' },
  feature: { label: '功能', icon: Star, color: 'text-yellow-500' },
  other: { label: '其他', icon: MessageCircle, color: 'text-gray-500' },
};

/**
 * 反馈历史页面组件
 */
export default function FeedbackHistoryPage() {
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FeedbackRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  // 加载反馈记录
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('xinji_feedback_history') || '[]');
    setFeedbackRecords(records);
    setFilteredRecords(records);
  }, []);

  // 过滤反馈记录
  useEffect(() => {
    let filtered = feedbackRecords;
    
    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.email && record.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 按类型过滤
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }
    
    setFilteredRecords(filtered);
  }, [searchTerm, filterType, feedbackRecords]);

  // 获取反馈类型图标
  const getTypeIcon = (type: string) => {
    const config = FEEDBACK_TYPE_CONFIG[type as keyof typeof FEEDBACK_TYPE_CONFIG];
    if (!config) return MessageCircle;
    return config.icon;
  };

  // 获取反馈类型标签
  const getTypeLabel = (type: string) => {
    const config = FEEDBACK_TYPE_CONFIG[type as keyof typeof FEEDBACK_TYPE_CONFIG];
    if (!config) return '未知';
    return config.label;
  };

  // 获取反馈类型颜色
  const getTypeColor = (type: string) => {
    const config = FEEDBACK_TYPE_CONFIG[type as keyof typeof FEEDBACK_TYPE_CONFIG];
    if (!config) return 'text-gray-500';
    return config.color;
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部 */}
      <header className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="btn-icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            反馈历史
          </h1>
        </div>
        
        {/* 搜索和过滤 */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索反馈内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'btn btn-ghost text-sm',
                filterType === 'all' && 'bg-primary text-primary-foreground'
              )}
            >
              全部
            </button>
            {Object.entries(FEEDBACK_TYPE_CONFIG).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'btn btn-ghost text-sm flex items-center gap-1',
                  filterType === type && 'bg-primary text-primary-foreground'
                )}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* 反馈记录列表 */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              暂无反馈记录
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' 
                ? '没有找到匹配的反馈记录' 
                : '您还没有提交过反馈'}
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const IconComponent = getTypeIcon(record.type);
            const formattedDate = new Date(record.timestamp).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return (
              <div 
                key={record.id} 
                className="card-interactive p-4 animate-in slide-up"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg bg-muted/50', getTypeColor(record.type))}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        <span>{getTypeLabel(record.type)}</span>
                        {record.rating && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  'w-3 h-3',
                                  i < record.rating! ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                                )} 
                              />
                            ))}
                          </div>
                        )}
                        {record.mood && (
                          <span className="text-lg">
                            {record.mood === 'great' ? '😄' :
                             record.mood === 'good' ? '😊' :
                             record.mood === 'okay' ? '😐' :
                             record.mood === 'bad' ? '😔' :
                             '😢'}
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formattedDate}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-2 line-clamp-3">
                      {record.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {record.isAnonymous ? (
                          <span className="text-xs text-muted-foreground">匿名提交</span>
                        ) : record.email ? (
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {record.email}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">未提供邮箱</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}