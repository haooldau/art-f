import React from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const ArtistPerformanceSidebar = ({
  artist,
  performances,
  onClose
}) => {
  if (!artist) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-md shadow-xl z-40 transform transition-transform duration-300">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {artist}的演出信息
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {performances.length > 0 ? (
            <div className="p-4 space-y-4">
              {performances.map((performance, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                  <div className="space-y-3">
                    {/* 日期和演出类型 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(performance.date).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">
                        {performance.type || '其他'}
                      </div>
                    </div>
                    
                    {/* 地点和场馆信息 */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {performance.province} {performance.city}
                        {performance.venue && ` · ${performance.venue}`}
                      </span>
                    </div>

                    {/* 海报 */}
                    {performance.poster && (
                      <img
                        src={`${API_BASE_URL}${performance.poster}`}
                        alt="演出海报"
                        className="w-full h-40 object-cover rounded-lg mt-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/160?text=暂无图片';
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              暂无演出信息
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistPerformanceSidebar; 