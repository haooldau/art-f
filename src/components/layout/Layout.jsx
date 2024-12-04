import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Calendar, Users, RefreshCw, Menu, X, BarChart, Home, Search, MapPin } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 定义菜单项
  const menuItems = [
    { name: '主页', icon: Home, path: '/' },
    { name: '演出分布', icon: Map, path: '/performance-map' },
    { name: '近期演出', icon: Calendar, path: '/recent-performances' },
    { name: '艺人', icon: Users, path: '/artists' },
    { name: '统计', icon: BarChart, path: '/statistics' },
    { name: '更新数据', icon: RefreshCw, path: '/update' },
  ];

  // 搜索建议分类
  const categories = {
    artists: { label: '艺人', icon: Users },
    venues: { label: '场馆', icon: Map },
    locations: { label: '地区', icon: MapPin }
  };

  // 处理搜索
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/performances`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const performances = data.data;
        const results = {
          artists: [],
          venues: [],
          locations: []
        };

        // 搜索并去重
        const seen = {
          artists: new Set(),
          venues: new Set(),
          locations: new Set()
        };

        performances.forEach(perf => {
          const searchLower = query.toLowerCase();
          
          // 艺人搜索
          if (perf.artist?.toLowerCase().includes(searchLower) && !seen.artists.has(perf.artist)) {
            seen.artists.add(perf.artist);
            results.artists.push({
              type: 'artist',
              value: perf.artist,
              detail: `${perf.province} ${perf.city}`,
              date: new Date(perf.date).toLocaleDateString('zh-CN')
            });
          }

          // 场馆搜索
          if (perf.venue?.toLowerCase().includes(searchLower) && !seen.venues.has(perf.venue)) {
            seen.venues.add(perf.venue);
            results.venues.push({
              type: 'venue',
              value: perf.venue,
              detail: `${perf.province} ${perf.city}`,
              date: new Date(perf.date).toLocaleDateString('zh-CN')
            });
          }

          // 地区搜索
          const location = `${perf.province}${perf.city}`;
          if (location.toLowerCase().includes(searchLower) && !seen.locations.has(location)) {
            seen.locations.add(location);
            results.locations.push({
              type: 'location',
              value: `${perf.province} ${perf.city}`,
              detail: perf.venue,
              date: new Date(perf.date).toLocaleDateString('zh-CN')
            });
          }
        });

        setSearchResults(results);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  // 处理搜索结果点击
  const handleResultClick = (result) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    // 根据不同类型的结果进行不同的导航
    switch (result.type) {
      case 'artist':
        navigate('/artists', { state: { selectedArtist: result.value } });
        break;
      case 'venue':
      case 'location':
        navigate('/performance-map', { state: { searchResult: result } });
        break;
      default:
        break;
    }
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="ml-4 text-white text-xl font-semibold flex items-center">
            <img src="/logo192.png" alt="SparkleLive Logo" className="w-8 h-8 object-contain mr-2" />
            SparkleLive
          </div>
        </div>

        {/* 搜索框 */}
        <div ref={searchRef} className="relative flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="搜索艺人、场馆、地区..."
              className={`
                w-full bg-white/5 border border-white/10 rounded-full 
                px-4 py-2 pl-10 text-white placeholder-white/50 
                focus:outline-none focus:border-[#db2626]/50
                transition-all duration-300 ease-in-out
                ${isSearchFocused ? 'animate-searchGlow bg-white/10' : ''}
              `}
            />
            <Search 
              className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                transition-colors duration-300
                ${isSearchFocused ? 'text-[#db2626]' : 'text-white/50'}
              `}
            />
          </div>

          {/* 搜索结果 */}
          {showSearchResults && searchQuery && (
            <div 
              className="
                absolute top-full left-0 right-0 mt-2 
                bg-black/90 backdrop-blur-md border border-white/10 
                rounded-lg overflow-hidden max-h-[70vh] overflow-y-auto 
                custom-scrollbar
                animate-searchResults
              "
            >
              {Object.entries(categories).map(([key, category]) => {
                const results = searchResults[key];
                if (results && results.length > 0) {
                  return (
                    <div key={key} className="p-2">
                      <div className="text-xs text-white/50 px-3 py-2 flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                      {results.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-3 hover:bg-[#db2626]/10 flex items-center justify-between group"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-white group-hover:text-[#db2626] transition-colors">
                              {result.value}
                            </span>
                            <span className="text-sm text-white/60">
                              {result.detail}
                            </span>
                          </div>
                          <span className="text-sm text-white/40">
                            {result.date}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
              
              {Object.values(searchResults).every(arr => arr.length === 0) && (
                <div className="px-4 py-3 text-white/50 text-center">
                  未找到相关结果
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧按钮 */}
        <div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            Log in
          </button>
        </div>
      </div>

      {/* 侧边导航栏 */}
      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out border-r border-white/5 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '16rem' }}
      >
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`w-full flex items-center px-6 py-3 text-base transition-colors ${
                location.pathname === item.path
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 主内容区域 */}
      <div 
        className={`
          pt-16 
          ${isSidebarOpen ? 'pl-64' : 'pl-0'} 
          transition-all duration-300 
          min-h-screen 
          bg-black 
          overflow-y-auto 
          custom-scrollbar
          flex-1
        `}
        style={{
          minHeight: 'calc(100vh - 4rem)',
          scrollBehavior: 'smooth'
        }}
      >
        <div className="min-h-full p-6 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 