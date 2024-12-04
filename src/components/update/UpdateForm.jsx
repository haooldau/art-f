import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Calendar, Users, Music, MapPin, Building2, Image as ImageIcon } from 'lucide-react';
import API_BASE_URL from '../../config/api';

// 添加省份数据
const provinces = [
  "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", 
  "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", 
  "浙江省", "安徽省", "福建省", "江西省", "山东省", 
  "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", 
  "海南省", "重庆市", "四川省", "贵州省", "云南省", 
  "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", 
  "新疆维吾尔自治区"
];

// 添加直辖市列表
const municipalities = ["北京市", "上海市", "天津市", "重庆市"];

// 示例城市数据，实际应该根据省份动态获取
const citiesMap = {
  "北京市": ["东城区", "西城区", "朝阳区", "海淀区", "丰台区", "石景山区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"],
  "上海市": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"],
  "浙江省": ["杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"],
  // ... 添加其他省份的城市数据
};

const UpdateForm = () => {
  const [formData, setFormData] = useState({
    artist: '',
    type: '',
    date: '',
    province: '',
    city: '',
    venue: '',
    poster: null
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // 添加日期格式化处理函数
  const formatDateInput = (value) => {
    // 移除所有非数字字符
    const numbers = value.replace(/\D/g, '');
    
    // 根据输入长度自动添加分隔符
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  // 修改省份处理逻辑
  const handleProvinceSelect = (province) => {
    // 如果是直辖市，自动设置城市为同名
    if (municipalities.includes(province)) {
      setFormData(prev => ({ 
        ...prev, 
        province,
        city: province  // 直辖市的城市名与省份名相同
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        province,
        city: ''  // 非直辖市清空城市选择
      }));
    }
    setFilteredProvinces([]);
  };

  // 修改城市处理逻辑
  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setFilteredCities([]);
  };

  // 修改输入处理逻辑
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      const formattedDate = formatDateInput(value);
      setFormData(prev => ({
        ...prev,
        date: formattedDate
      }));
    } else if (name === 'province') {
      const filtered = provinces.filter(p => 
        p.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProvinces(filtered);
      setFormData(prev => ({ ...prev, province: value, city: '' }));
    } else if (name === 'city') {
      if (!formData.province) return;
      
      const cities = citiesMap[formData.province] || [];
      const filtered = cities.filter(c => 
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setFormData(prev => ({ ...prev, city: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        poster: file
      }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/performances`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        triggerConfetti();
        setFormData({
          artist: '',
          type: '',
          date: '',
          province: '',
          city: '',
          venue: '',
          poster: null
        });
        setPreviewUrl(null);
      }
    } catch (error) {
      setError('提交失败，请检查输入并重试');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 在表单中添加错误提示组件
  const ErrorMessage = () => {
    if (!error) return null;
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
        {error}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">
            更新演出信息 <span className="text-[#ff2d2d] font-normal">Update Performance</span>
          </h1>
          <p className="text-gray-500">添加新的演出信息到数据库</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111] rounded-xl p-8">
          {error && <ErrorMessage />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 第一行：艺人和类型 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                艺人
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white"
                placeholder="请输入艺人名称"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Music className="w-4 h-4" />
                类型
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white appearance-none cursor-pointer"
              >
                <option value="">选择类型</option>
                <option value="演唱会">演唱会</option>
                <option value="音乐节">音乐节</option>
              </select>
            </div>

            {/* 第二行：日期和场馆 */}
            <div className="space-y-2 relative">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                日期
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white pr-10"
                  placeholder="YYYY-MM-DD"
                  maxLength="10"
                  required
                />
                <input
                  type="date"
                  className="absolute opacity-0 -z-10"
                  id="hidden-date"
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: 'date',
                        value: e.target.value
                      }
                    });
                  }}
                />
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => {
                    document.getElementById('hidden-date').showPicker();
                  }}
                >
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Building2 className="w-4 h-4" />
                场馆
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white"
                placeholder="演出场馆名称"
                required
              />
            </div>

            {/* 第三行：省份和城市 (合并为一行) */}
            <div className="space-y-2 md:col-span-2 grid grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  省份
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (!filteredProvinces.length) {
                      setFilteredProvinces(provinces);
                    }
                  }}
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white"
                  placeholder="输入或选择省份"
                  required
                />
                {filteredProvinces.length > 0 && (
                  <div className="absolute w-full mt-1 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                    {filteredProvinces.map((province) => (
                      <div
                        key={province}
                        className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer text-gray-300"
                        onClick={() => handleProvinceSelect(province)}
                      >
                        {province}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 relative">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <Building2 className="w-4 h-4" />
                  城市
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (formData.province && !municipalities.includes(formData.province) && !filteredCities.length) {
                      setFilteredCities(citiesMap[formData.province] || []);
                    }
                  }}
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff2d2d] text-white"
                  placeholder={
                    !formData.province 
                      ? "请先选择省份" 
                      : municipalities.includes(formData.province)
                        ? formData.province
                        : "输入或选择城市"
                  }
                  required
                  disabled={!formData.province || municipalities.includes(formData.province)}
                />
                {!municipalities.includes(formData.province) && filteredCities.length > 0 && (
                  <div className="absolute w-full mt-1 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer text-gray-300"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 海报上传 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <ImageIcon className="w-4 h-4" />
              海报
            </label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img 
                  src={previewUrl}
                  alt="海报预览"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#0A0A0A] border border-gray-800 flex items-center justify-center text-gray-500 text-xs">
                  暂无海报
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="poster-upload"
              />
              <label 
                htmlFor="poster-upload"
                className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-gray-800 hover:border-[#ff2d2d] text-gray-400 cursor-pointer transition-all duration-300 text-sm flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                上传海报
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-[#ff2d2d] hover:bg-[#ff2d2d]/90 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>提交中...</span>
                </div>
              ) : (
                <span>提交</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm; 