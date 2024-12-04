const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'  // 开发环境
  : 'https://artback.hkg1.zeabur.app/api';  // 生产环境

// 统一的 API 请求配置
const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// 图片资源路径处理
const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160?text=暂无图片';
  return process.env.NODE_ENV === 'development' 
    ? `http://localhost:3001${path}`
    : `https://artback.hkg1.zeabur.app${path}`;
};

export default API_BASE_URL;
export { API_CONFIG, getImageUrl };