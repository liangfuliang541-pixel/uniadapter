/**
 * ============================================
 * 心迹 XinJi - 用户反馈模态框组件
 * ============================================
 * 
 * 提供用户反馈入口，收集用户对产品的使用意见
 * 支持多种反馈类型和匿名提交
 */

import { useState, useEffect } from 'react';
import { X, Send, Star, MessageCircle, Bug, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import type { MoodType } from '@/core/types';

/**
 * 反馈类型枚举
 */
type FeedbackType = 'suggestion' | 'bug' | 'compliment' | 'feature' | 'other';

/**
 * 反馈评分类型
 */
type FeedbackRating = 1 | 2 | 3 | 4 | 5;

/**
 * 反馈表单数据接口
 */
interface FeedbackFormData {
  type: FeedbackType;
  rating: FeedbackRating | null;
  message: string;
  email: string;
  isAnonymous: boolean;
  mood: MoodType | null;
}

/**
 * 反馈模态框组件属性接口
 */
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 用户反馈模态框组件
 * 提供友好的界面收集用户对产品的使用意见
 */
export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'suggestion',
    rating: null,
    message: '',
    email: '',
    isAnonymous: false,
    mood: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'type' | 'rating' | 'details'>('type');
  const toast = useToast();

  // 重置表单
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        type: 'suggestion',
        rating: null,
        message: '',
        email: '',
        isAnonymous: false,
        mood: null,
      });
      setStep('type');
    }
  }, [isOpen]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 这里可以集成真实的反馈收集API
      // 模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存反馈到本地存储（实际项目中应该发送到服务器）
      const feedbackHistory = JSON.parse(localStorage.getItem('xinji_feedback_history') || '[]');
      feedbackHistory.unshift({
        ...formData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      });
      localStorage.setItem('xinji_feedback_history', JSON.stringify(feedbackHistory));

      toast.success('感谢您的宝贵意见！您的反馈已收到 🙏');
      onClose();
    } catch (error) {
      toast.error('提交失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理字段变更
  const handleInputChange = (field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 渲染反馈类型选择
  const renderTypeSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        请选择反馈类型
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {([
          { type: 'suggestion', label: '建议', icon: Sparkles, color: 'text-blue-500' },
          { type: 'bug', label: '问题', icon: Bug, color: 'text-red-500' },
          { type: 'compliment', label: '夸奖', icon: Heart, color: 'text-pink-500' },
          { type: 'feature', label: '功能', icon: Star, color: 'text-yellow-500' },
        ] as const).map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => {
              handleInputChange('type', type);
              setStep('rating');
            }}
            className={cn(
              'p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2',
              formData.type === type
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            )}
          >
            <Icon className={`w-6 h-6 ${color}`} />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // 渲染评分选择
  const renderRatingSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        请给我们打分
      </h3>
      
      <div className="flex justify-center space-x-3 mb-6">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => handleInputChange('rating', rating as FeedbackRating)}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all',
              formData.rating === rating
                ? 'bg-primary text-primary-foreground scale-110'
                : 'bg-muted hover:bg-accent'
            )}
          >
            {rating}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleInputChange('mood', 'great')}
          className={cn(
            'p-2 rounded-lg flex flex-col items-center gap-1 transition-all',
            formData.mood === 'great' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'hover:bg-muted'
          )}
        >
          <span className="text-2xl">😄</span>
          <span className="text-xs">很棒</span>
        </button>
        <button
          onClick={() => handleInputChange('mood', 'good')}
          className={cn(
            'p-2 rounded-lg flex flex-col items-center gap-1 transition-all',
            formData.mood === 'good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-muted'
          )}
        >
          <span className="text-2xl">😊</span>
          <span className="text-xs">不错</span>
        </button>
        <button
          onClick={() => handleInputChange('mood', 'okay')}
          className={cn(
            'p-2 rounded-lg flex flex-col items-center gap-1 transition-all',
            formData.mood === 'okay' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'hover:bg-muted'
          )}
        >
          <span className="text-2xl">😐</span>
          <span className="text-xs">一般</span>
        </button>
        <button
          onClick={() => handleInputChange('mood', 'bad')}
          className={cn(
            'p-2 rounded-lg flex flex-col items-center gap-1 transition-all',
            formData.mood === 'bad' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'hover:bg-muted'
          )}
        >
          <span className="text-2xl">😔</span>
          <span className="text-xs">不好</span>
        </button>
        <button
          onClick={() => handleInputChange('mood', 'awful')}
          className={cn(
            'p-2 rounded-lg flex flex-col items-center gap-1 transition-all',
            formData.mood === 'awful' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'hover:bg-muted'
          )}
        >
          <span className="text-2xl">😢</span>
          <span className="text-xs">很差</span>
        </button>
      </div>
    </div>
  );

  // 渲染详细信息输入
  const renderDetailsInput = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        详细描述
      </h3>
      
      <div className="space-y-3">
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder={
            formData.type === 'suggestion' ? '您希望我们如何改进？' :
            formData.type === 'bug' ? '遇到了什么问题？' :
            formData.type === 'compliment' ? '您最喜欢我们的哪些功能？' :
            formData.type === 'feature' ? '您希望我们添加什么功能？' :
            '请告诉我们您的想法...'
          }
          className="textarea"
          rows={5}
          required
        />
        
        <div className="flex items-center gap-3">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="邮箱（可选，用于回复）"
            className="input flex-1"
          />
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">匿名提交</span>
          </label>
        </div>
      </div>
    </div>
  );

  // 渲染导航按钮
  const renderNavigation = () => {
    if (step === 'type') return null;
    
    return (
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (step === 'details') setStep('rating');
            else if (step === 'rating') setStep('type');
          }}
          className="btn btn-ghost"
        >
          上一步
        </button>
        
        <button
          type="submit"
          disabled={!formData.message.trim() || isSubmitting}
          className="btn btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isSubmitting ? '提交中...' : '提交反馈'}
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md glass rounded-2xl p-6 animate-in slide-up safe-bottom z-[101]">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            反馈与建议
          </h2>
          <button 
            onClick={onClose}
            className="btn-icon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 步骤指示器 */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-8 h-1 rounded-full transition-all',
              step === 'type' ? 'bg-primary flex-1' : 'bg-muted'
            )} />
            <div className={cn(
              'w-8 h-1 rounded-full transition-all',
              step === 'rating' ? 'bg-primary flex-1' : 'bg-muted'
            )} />
            <div className={cn(
              'w-8 h-1 rounded-full transition-all',
              step === 'details' ? 'bg-primary flex-1' : 'bg-muted'
            )} />
          </div>
        </div>
        
        {/* 表单内容 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            {step === 'type' && renderTypeSelection()}
            {step === 'rating' && renderRatingSelection()}
            {step === 'details' && renderDetailsInput()}
          </div>
          
          {/* 导航按钮 */}
          {renderNavigation()}
        </form>
        
        {/* 底部说明 */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          您的反馈将帮助我们做得更好
        </p>
      </div>
    </div>
  );
}