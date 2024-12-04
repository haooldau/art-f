import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PerformanceTimeline = ({ performances, onArtistClick }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [centerDate, setCenterDate] = useState(new Date());

  // 获取日期范围（前1个月到后3个月）
  const getDates = (centerDate) => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1); // 从一个月前开始
    
    // 生成120天的日期
    for (let i = 0; i < 120; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 检查日期是否有演出
  const getPerformancesForDate = (date) => {
    return performances.filter(perf => {
      const perfDate = new Date(perf.date);
      return perfDate.toDateString() === date.toDateString();
    });
  };

  // 处理滚动
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // 滚动控制
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* 左箭头 */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* 时间轴 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto hide-scrollbar relative"
      >
        <div className="flex gap-4 p-4">
          {getDates(centerDate).map((date, index) => {
            const dayPerformances = getPerformancesForDate(date);
            const hasPerformances = dayPerformances.length > 0;

            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  if (hasPerformances) {
                    dayPerformances.forEach(perf => {
                      onArtistClick(perf.artist);
                    });
                  }
                }}
                className={`flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  hasPerformances
                    ? 'bg-white/10 hover:bg-white/20 cursor-pointer'
                    : 'bg-black/20'
                }`}
              >
                <div className="text-sm text-gray-400">
                  {date.toLocaleDateString('zh-CN', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-medium ${
                  hasPerformances ? 'text-white' : 'text-gray-600'
                }`}>
                  {date.getDate()}
                </div>
                {hasPerformances && (
                  <div className="text-xs text-white/60">
                    {dayPerformances.length}场演出
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 右箭头 */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default PerformanceTimeline; 