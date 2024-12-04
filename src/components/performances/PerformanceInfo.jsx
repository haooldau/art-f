import React from 'react';
import { Calendar, MapPin, Music } from 'lucide-react';

const PerformanceInfo = ({ performances, onArtistClick, onVenueClick }) => {
  if (!performances || performances.length === 0) {
    return (
      <div className="p-4 bg-black/30 rounded-lg">
        <p className="text-gray-400 text-center">该地区暂无演出信息</p>
      </div>
    );
  }

  // 按艺人分组演出
  const performancesByArtist = performances.reduce((groups, performance) => {
    const artist = performance.artist || '未知艺人';
    if (!groups[artist]) {
      groups[artist] = [];
    }
    groups[artist].push(performance);
    return groups;
  }, {});

  return (
    <div className="h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {Object.entries(performancesByArtist).map(([artist, artistPerformances]) => (
          <div key={artist} className="space-y-4">
            <button
              onClick={() => onArtistClick(artist)}
              className="text-lg font-semibold text-white hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <Music className="w-5 h-5" />
              {artist}
            </button>
            <div className="space-y-4">
              {artistPerformances.map((performance, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(performance.date).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">
                        {performance.type || '其他'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-white/60">省份：</span>
                        <span>{performance.province}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 pl-6">
                        <span className="text-white/60">城市：</span>
                        <span>{performance.city}</span>
                      </div>
                      <button
                        onClick={() => onVenueClick(performance)}
                        className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors w-full text-left pl-6"
                      >
                        <span className="text-white/60">场馆：</span>
                        <span>{performance.venue}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceInfo; 