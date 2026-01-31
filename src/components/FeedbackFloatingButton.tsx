/**
 * ============================================
 * 心迹 XinJi - 反馈浮动按钮组件
 * ============================================
 * 
 * 提供便捷的反馈入口，悬浮在页面右下角
 * 点击后打开反馈模态框
 */

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import FeedbackModal from './FeedbackModal';

/**
 * 反馈浮动按钮组件属性接口
 */
interface FeedbackFloatingButtonProps {
  className?: string;
}

/**
 * 反馈浮动按钮组件
 * 固定在页面右下角，提供快速反馈入口
 */
export default function FeedbackFloatingButton({ className }: FeedbackFloatingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 浮动反馈按钮 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group',
          'hover:scale-110 active:scale-95',
          className
        )}
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="sr-only">反馈</span>
        
        {/* 悬浮提示 */}
        <div className="absolute -top-8 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          给我们反馈
        </div>
      </button>

      {/* 反馈模态框 */}
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}