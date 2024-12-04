import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import PerformanceInfo from '../performances/PerformanceInfo';
import '../../styles/card.css';
import API_BASE_URL from '../../config/api';
import ChinaMap from './ChinaMap';
import PerformanceDetailCard from '../performances/PerformanceDetailCard';

const CHINA_MAP_API = '/data/china.json';

const PerformanceMap = () => {
  const [mapData, setMapData] = useState(null);
  const [performanceData, setPerformanceData] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistPerformances, setArtistPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 100, y: 100 });
  const [isFlipped, setIsFlipped] = useState(false);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [selectedPerformance, setSelectedPerformance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取地图数据
        const mapResponse = await fetch(CHINA_MAP_API);
        if (!mapResponse.ok) throw new Error('获取地图数据失败');
        const mapJson = await mapResponse.json();
        setMapData(mapJson);

        // 获取演出数据
        const response = await fetch(`${API_BASE_URL}/performances`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && Array.isArray(data.data)) {
          // 处理数据并按省份分组
          const dataByProvince = {};
          data.data.forEach(performance => {
            const provinceName = performance.province
              .replace(/省|自治区|维吾尔|回族|壮族|特别行政区/g, '')
              .trim();
            
            if (!dataByProvince[provinceName]) {
              dataByProvince[provinceName] = [];
            }
            
            dataByProvince[provinceName].push({
              ...performance,
              date: performance.date ? new Date(performance.date) : null,
              created_at: performance.created_at ? new Date(performance.created_at) : null
            });
          });
          
          setPerformanceData(dataByProvince);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMapClick = (event) => {
    if (event.target.tagName === 'svg' || event.target.tagName === 'rect') {
      setSelectedArtist(null);
      setArtistPerformances([]);
    }
  };

  const handleProvinceClick = (feature) => {
    const provinceName = feature.properties.name
      .replace(/省|自治区|维吾尔|回族|壮族|特别行政区/g, '')
      .trim();
    
    if (isFlipped) {
      setSelectedArtist(null);
      setArtistPerformances([]);
      setIsFlipped(false);
    }
    
    setSelectedProvince({
      properties: feature.properties,
      performances: performanceData[provinceName] || []
    });
  };

  const handleDragStart = (e) => {
    if (e.target.closest('.card-header')) {
      isDragging.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleDrag = (e) => {
    if (isDragging.current) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setCardPosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    const artistPerformances = Object.values(performanceData)
      .flat()
      .filter(perf => perf.artist === artist)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setArtistPerformances(artistPerformances);
  };

  const handleVenueClick = (performance) => {
    setSelectedPerformance(performance);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">正在加载演出数据...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
        <h3 className="text-red-500 font-semibold mb-2">数据加载失败</h3>
        <p className="text-gray-400">{error}</p>
        <div className="mt-4 flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500"
          >
            重试
          </button>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );

  if (!mapData || !mapData.features) return null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 背景装饰效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a1a1a,transparent_50%)]" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-red-500/3 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto p-8">
        {/* 标题区域 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">演出分布</h2>
          <p className="text-gray-400">全国演出数据可视化地图</p>
        </div>

        <div className="relative">
          {/* 地图容器 */}
          <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 shadow-2xl">
            <ChinaMap 
              mapData={mapData}
              performanceData={performanceData}
              selectedProvince={selectedProvince}
              selectedArtist={selectedArtist}
              onProvinceClick={handleProvinceClick}
            />
          </div>

          {/* 可拖拽的翻转卡片 */}
          {selectedProvince && (
            <div 
              className="fixed w-96 h-[600px] perspective-1000 z-50"
              style={{
                left: `${cardPosition.x}px`,
                top: `${cardPosition.y}px`,
              }}
              onMouseDown={handleDragStart}
            >
              <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* 正面 - 省份信息 */}
                <div className="absolute w-full h-full backface-hidden bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                  <div className="card-header p-4 border-b border-white/10 flex justify-between items-center bg-black/50 cursor-move">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">
                        {selectedProvince.properties.name}演出信息
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedProvince(null)}
                      className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">
                    <PerformanceInfo
                      performances={selectedProvince.performances}
                      onArtistClick={(artist) => {
                        handleArtistClick(artist);
                        setIsFlipped(true);
                      }}
                      onVenueClick={handleVenueClick}
                    />
                  </div>
                </div>

                {/* 背面 - 艺人信息 */}
                <div className="absolute w-full h-full backface-hidden bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden rotate-y-180">
                  <div className="card-header p-4 border-b border-white/10 flex justify-between items-center bg-black/50 cursor-move">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsFlipped(false);
                          setSelectedArtist(null);
                        }}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedArtist}的演出信息
                      </h3>
                    </div>
                  </div>

                  <div className="h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar p-4">
                    <div className="space-y-4">
                      {artistPerformances.map((performance, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(performance.date).toLocaleDateString('zh-CN')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {performance.province} {performance.city}
                                {performance.venue && ` - ${performance.venue}`}
                              </span>
                            </div>
                            {performance.notes && (
                              <div className="text-sm text-gray-400 mt-2">
                                备注: {performance.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 演出详情卡片 */}
      {selectedPerformance && (
        <PerformanceDetailCard
          performance={selectedPerformance}
          allPerformances={Object.values(performanceData).flat()}
          currentProvince={selectedProvince.properties.name}
          onClose={() => setSelectedPerformance(null)}
        />
      )}
    </div>
  );
};

export default PerformanceMap; 