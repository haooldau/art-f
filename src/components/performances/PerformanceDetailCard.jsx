import React from 'react';
import { X, Calendar, MapPin, Building2, Music } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const PerformanceDetailCard = ({ 
  performance, 
  allPerformances, 
  onClose,
  currentProvince 
}) => {
  // 获取同一演出在其他省份的演出信息
  const otherProvincePerformances = allPerformances.filter(p => 
    p.artist === performance.artist && 
    p.type === performance.type &&
    p.venue !== performance.venue
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">演出详情</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 主要内容 - 添加滚动区域 */}
        <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 4rem)' }}>
          {/* 当前省份演出信息 */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-white mb-4">
              {currentProvince}站
            </h4>
            <div className="flex gap-8">
              <div className="flex-1 space-y-4">
                {/* 艺人信息 */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Music className="w-5 h-5" />
                  <span>{performance.artist}</span>
                </div>
                
                {/* 日期信息 */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(performance.date).toLocaleDateString('zh-CN')}</span>
                </div>

                {/* 地点信息 - 分开显示 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span className="text-white/60">省份：</span>
                    <span>{performance.province}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 pl-7">
                    <span className="text-white/60">城市：</span>
                    <span>{performance.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 pl-7">
                    <span className="text-white/60">场馆：</span>
                    <span>{performance.venue}</span>
                  </div>
                </div>
              </div>
              {performance.poster && (
                <div className="w-64 h-80">
                  <img
                    src={`${API_BASE_URL}${performance.poster}`}
                    alt="演出海报"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 其他省份演出信息 */}
          {otherProvincePerformances.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-4">其他站点</h4>
              <div className="grid grid-cols-2 gap-6">
                {otherProvincePerformances.map((perf, index) => (
                  <div key={index} className="flex gap-4 bg-white/5 rounded-lg p-4">
                    <div className="flex-1 space-y-3">
                      <div className="text-gray-300">
                        {new Date(perf.date).toLocaleDateString('zh-CN')}
                      </div>
                      <div className="space-y-1">
                        <div className="text-white/60 text-sm">省份：
                          <span className="text-white ml-1">{perf.province}</span>
                        </div>
                        <div className="text-white/60 text-sm">城市：
                          <span className="text-white ml-1">{perf.city}</span>
                        </div>
                        <div className="text-white/60 text-sm">场馆：
                          <span className="text-white ml-1">{perf.venue}</span>
                        </div>
                      </div>
                    </div>
                    {perf.poster && (
                      <div className="w-24 h-32">
                        <img
                          src={`${API_BASE_URL}${perf.poster}`}
                          alt="演出海报"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDetailCard; 