import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import PerformanceGrid from './PerformanceGrid';
import PerformanceCalendar from './PerformanceCalendar';
import ExpandableCard from './ExpandableCard';

const RecentPerformances = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDayPerformances, setSelectedDayPerformances] = useState(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 添加获取演出数据的函数
  const fetchPerformances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/performances`);
      if (response.data.success) {
        const formattedData = response.data.data.map(perf => ({
          ...perf,
          date: new Date(perf.date)
        }));
        setPerformances(formattedData);
      }
    } catch (error) {
      console.error('获取演出数据失败:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformances();
  }, []);

  useEffect(() => {
    // 计算未来一个月的演出数量
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const count = performances.filter(perf => {
      const perfDate = new Date(perf.date);
      return perfDate >= new Date() && perfDate <= oneMonthFromNow;
    }).length;
    setUpcomingCount(count);
  }, [performances]);

  // 获取日期范围内的演出
  const getDaysInRange = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7); // 显示前一周

    for (let i = 0; i < 21; i++) { // 显示三周
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayPerformances = performances.filter(perf => 
        new Date(perf.date).toDateString() === date.toDateString()
      );
      days.push({
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        performances: dayPerformances
      });
    }
    return days;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // 处理艺人点击
  const handleArtistClick = (artist) => {
    const artistPerformances = performances.filter(p => p.artist === artist);
    setSelectedArtist({
      name: artist,
      performances: artistPerformances
    });
    setShowArtistModal(true);
  };

  // 处理日期点击
  const handleDayClick = (date, performances) => {
    if (performances.length > 0) {
      setSelectedDayPerformances({
        date,
        performances
      });
      setShowDayModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#db2626] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="bg-[#db2626]/10 border border-[#db2626]/20 rounded-lg p-6 max-w-md">
          <h3 className="text-[#db2626] font-semibold mb-2">数据加载失败</h3>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题和控制栏 */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[#db2626] text-3xl font-medium">近期演出</h1>
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm">
                共 {upcomingCount} 场演出
              </div>
              <button
                onClick={handleTodayClick}
                className={`
                  flex items-center gap-2 px-4 py-1.5 
                  bg-[#1d1e22] hover:bg-[#2d2e32] 
                  text-white/90 text-sm rounded-full
                  border border-white/5 transition-all duration-300
                  hover:border-white/10
                `}
              >
                <Calendar className="w-4 h-4" />
                TODAY
              </button>
            </div>
          </div>

          {/* 时间轴 */}
          <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <button
                  onClick={handlePrevWeek}
                  className="p-2 rounded-full bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <button
                  onClick={handleNextWeek}
                  className="p-2 rounded-full bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-hidden mx-10">
                <div className="flex gap-4 py-4 relative">
                  {getDaysInRange().map((day, index) => (
                    <div
                      key={index}
                      className={`
                        flex-shrink-0 w-24 h-32 rounded-xl 
                        ${day.isToday ? 'bg-[#db2626]/20' : 'bg-black/20'} 
                        backdrop-blur-md border border-white/5
                        flex flex-col items-center justify-center gap-2
                        ${day.performances.length > 0 ? 'ring-1 ring-[#db2626]/50' : ''}
                      `}
                    >
                      <div className="text-sm text-white/60">
                        {day.date.toLocaleDateString('zh-CN', { weekday: 'short' })}
                      </div>
                      <div className={`text-2xl font-medium ${day.isToday ? 'text-[#db2626]' : 'text-white'}`}>
                        {day.date.getDate()}
                      </div>
                      {day.performances.length > 0 && (
                        <div className="text-xs text-[#db2626]">
                          {day.performances.map(p => p.venue).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 彩带效果 */}
                  {showConfetti && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(80)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-confetti"
                          style={{
                            left: `${Math.random() * 120 - 10}%`,
                            top: '-10px',
                            width: `${2 + Math.random() * 4}px`,
                            height: `${15 + Math.random() * 15}px`,
                            background: `hsl(${Math.random() * 360}, 85%, 65%)`,
                            transform: `rotate(${-30 + Math.random() * 60}deg)`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            animationDuration: `${0.8 + Math.random() * 0.6}s`,
                            opacity: 0.7 + Math.random() * 0.3,
                            filter: `brightness(${1.1 + Math.random() * 0.4})`,
                            boxShadow: '0 0 3px rgba(255,255,255,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 艺人云图和演出日历 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左：重点艺人（艺人云图） */}
            <div className="relative bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[500px]">
              <h2 className="text-xl font-semibold text-white mb-4">重点艺人</h2>
              <div className="h-[calc(100%-2rem)]">
                <PerformanceGrid 
                  performances={performances}
                  onArtistClick={handleArtistClick}
                />
              </div>

              {/* 艺人详情展开卡片 */}
              {selectedArtist && (
                <ExpandableCard
                  title={`${selectedArtist.name} 的演出信息`}
                  isOpen={showArtistModal}
                  onClose={() => setShowArtistModal(false)}
                >
                  <div className="space-y-4">
                    {selectedArtist.performances.map((perf, index) => (
                      <div
                        key={index}
                        className="bg-black/20 rounded-lg p-4 border border-white/5 animate-cardIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="text-white/60">
                              {new Date(perf.date).toLocaleDateString('zh-CN')}
                            </div>
                            <div className="text-white font-medium">
                              {perf.province} {perf.city}
                            </div>
                            <div className="text-white/80">{perf.venue}</div>
                          </div>
                          {perf.poster && (
                            <img
                              src={`${API_BASE_URL}${perf.poster}`}
                              alt="演出海报"
                              className="w-24 h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ExpandableCard>
              )}
            </div>

            {/* 右侧：演出日历 */}
            <div className="relative bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[500px]">
              <h2 className="text-xl font-semibold text-white mb-4">演出日历</h2>
              <div className="h-[calc(100%-2rem)]">
                <PerformanceCalendar 
                  performances={performances}
                  onDateClick={handleDayClick}
                />
              </div>

              {/* 日期详情展开卡片 */}
              {selectedDayPerformances && (
                <ExpandableCard
                  title={`${selectedDayPerformances.date.toLocaleDateString('zh-CN')} 演出信息`}
                  isOpen={showDayModal}
                  onClose={() => setShowDayModal(false)}
                >
                  <div className="space-y-4">
                    {selectedDayPerformances.performances.map((perf, index) => (
                      <div
                        key={index}
                        className="bg-black/20 rounded-lg p-4 border border-white/5 animate-cardIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="text-white font-medium text-lg">
                              {perf.artist}
                            </div>
                            <div className="text-white">
                              {perf.province} {perf.city}
                            </div>
                            <div className="text-white/80">{perf.venue}</div>
                          </div>
                          {perf.poster && (
                            <img
                              src={`${API_BASE_URL}${perf.poster}`}
                              alt="演出海报"
                              className="w-24 h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ExpandableCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#db2626]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#db2626]/3 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default RecentPerformances; 