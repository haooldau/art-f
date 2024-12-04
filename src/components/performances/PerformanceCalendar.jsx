import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PerformanceCalendar = ({ performances, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showGrass, setShowGrass] = useState(false);
  const [grassPosition, setGrassPosition] = useState({ date: null });

  // 生成日历数据
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是星期几（0-6）
    const firstDayOfWeek = firstDay.getDay();
    
    // 生成日历数组
    const days = [];
    
    // 添加上月剩余天数
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push({
        date,
        isCurrentMonth: false,
        performances: getPerformancesForDate(date)
      });
    }
    
    // 添加当月天数
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        performances: getPerformancesForDate(date)
      });
    }
    
    // 添加下月开始的天数，补满6行
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        performances: getPerformancesForDate(date)
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, performances]);

  // 获取指定日期的演出
  const getPerformancesForDate = (date) => {
    return performances.filter(perf => {
      const perfDate = new Date(perf.date);
      return perfDate.getDate() === date.getDate() &&
             perfDate.getMonth() === date.getMonth() &&
             perfDate.getFullYear() === date.getFullYear();
    });
  };

  // 切换月份
  const changeMonth = (increment) => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  // 处理日期点击
  const handleDateClick = (date, performances) => {
    if (performances.length > 0) {
      onDateClick(date, performances);
    } else {
      setGrassPosition({ date });
      setShowGrass(true);
      setTimeout(() => setShowGrass(false), 2000);
    }
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="h-full flex flex-col">
      {/* 月份切换 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>
        <span className="text-lg text-white">
          {currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* 日历网格 */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden">
        {/* 星期标题 */}
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm text-white/40 bg-black/20">
            {day}
          </div>
        ))}
        
        {/* 日期格子 */}
        {calendarDays.map((day, index) => {
          const isToday = day.date.toDateString() === new Date().toDateString();
          const performanceCount = day.performances.length;
          const isHovered = hoveredDate?.toDateString() === day.date.toDateString();
          const hasGrass = grassPosition.date?.toDateString() === day.date.toDateString();
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day.date, day.performances)}
              onMouseEnter={() => setHoveredDate(day.date)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`
                relative p-2 text-center transition-all duration-300
                ${!day.isCurrentMonth ? 'bg-black/40 text-white/20' : 'bg-black/20'}
                ${isToday ? 'text-[#db2626]' : 'text-white'}
                ${isHovered ? 'transform scale-110 z-10' : ''}
                hover:bg-black/40
              `}
            >
              <span className={`text-sm ${isToday ? 'font-medium' : ''}`}>
                {day.date.getDate()}
              </span>
              
              {performanceCount > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-[#db2626]">
                  {performanceCount}场
                </div>
              )}

              {/* 长草彩蛋 */}
              {hasGrass && showGrass && (
                <div className="absolute inset-0 flex items-center justify-center animate-grassGrow">
                  <span className="text-green-500 text-2xl" role="img" aria-label="grass">
                    🌱
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceCalendar; 