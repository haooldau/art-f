import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Calendar, Users, MapPin } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const StatisticsView = () => {
  const [statistics, setStatistics] = useState({
    totalPerformances: 0,
    totalArtists: 0,
    totalVenues: 0,
    performancesByMonth: {},
    performancesByProvince: {},
    topArtists: [],
    topVenues: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/performances`);
        if (response.data.success) {
          const performances = response.data.data;
          processStatistics(performances);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const processStatistics = (performances) => {
    // 统计基础数据
    const artists = new Set(performances.map(p => p.artist));
    const venues = new Set(performances.map(p => p.venue));

    // 按月份统计
    const byMonth = performances.reduce((acc, perf) => {
      const month = new Date(perf.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // 按省份统计
    const byProvince = performances.reduce((acc, perf) => {
      acc[perf.province] = (acc[perf.province] || 0) + 1;
      return acc;
    }, {});

    // 艺人演出次数排名
    const artistPerformances = performances.reduce((acc, perf) => {
      acc[perf.artist] = (acc[perf.artist] || 0) + 1;
      return acc;
    }, {});

    const topArtists = Object.entries(artistPerformances)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // 场馆使用次数排名
    const venuePerformances = performances.reduce((acc, perf) => {
      acc[perf.venue] = (acc[perf.venue] || 0) + 1;
      return acc;
    }, {});

    const topVenues = Object.entries(venuePerformances)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    setStatistics({
      totalPerformances: performances.length,
      totalArtists: artists.size,
      totalVenues: venues.size,
      performancesByMonth: byMonth,
      performancesByProvince: byProvince,
      topArtists,
      topVenues
    });
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
          {/* 页面标题 */}
          <h1 className="text-[#db2626] text-3xl font-medium">数据统计</h1>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#db2626]/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#db2626]" />
                </div>
                <div>
                  <div className="text-sm text-white/60">总演出场次</div>
                  <div className="text-2xl font-semibold text-white">{statistics.totalPerformances}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#db2626]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#db2626]" />
                </div>
                <div>
                  <div className="text-sm text-white/60">参演艺人</div>
                  <div className="text-2xl font-semibold text-white">{statistics.totalArtists}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#db2626]/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-[#db2626]" />
                </div>
                <div>
                  <div className="text-sm text-white/60">演出场馆</div>
                  <div className="text-2xl font-semibold text-white">{statistics.totalVenues}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 详细统计 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 月度演出统计 */}
            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                月度演出统计
              </h2>
              <div className="space-y-4">
                {Object.entries(statistics.performancesByMonth).map(([month, count]) => (
                  <div key={month} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-white/60">{month}</div>
                    <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#db2626] rounded-full transition-all duration-1000"
                        style={{
                          width: `${(count / Math.max(...Object.values(statistics.performancesByMonth))) * 100}%`
                        }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-white">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 热门艺人排行 */}
            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                热门艺人排行
              </h2>
              <div className="space-y-4">
                {statistics.topArtists.map(([artist, count], index) => (
                  <div key={artist} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#db2626]/10 flex items-center justify-center text-[#db2626] font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{artist}</div>
                      <div className="text-sm text-white/60">{count} 场演出</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 省份分布统计条 */}
            <div className="bg-[#1a1b1e]/50 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                省份分布统计
              </h2>
              <div className="space-y-4">
                {Object.entries(statistics.performancesByProvince)
                  .sort(([,a], [,b]) => b - a)
                  .map(([province, count]) => (
                    <div key={province} className="flex items-center gap-3 py-1">
                      <div className="min-w-[60px] text-sm text-white/60">{province}</div>
                      <div className="flex-1 h-3 bg-black/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#db2626] rounded-full transition-all duration-1000"
                          style={{
                            width: `${(count / Math.max(...Object.values(statistics.performancesByProvince))) * 100}%`
                          }}
                        />
                      </div>
                      <div className="min-w-[30px] text-right text-sm text-white">{count}</div>
                    </div>
                  ))}
              </div>
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

export default StatisticsView; 