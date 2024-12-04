import React, { useState, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';

const PerformanceGrid = ({ performances, onArtistClick }) => {
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const lastUpdateTime = useRef(Date.now());
  const isAnimating = useRef(true);

  // 获取所有艺人及其演出次数
  const getArtistStats = () => {
    const stats = performances.reduce((acc, perf) => {
      if (!perf.artist) return acc;
      if (!acc[perf.artist]) {
        acc[perf.artist] = 0;
      }
      acc[perf.artist]++;
      return acc;
    }, {});

    return Object.entries(stats)
      .map(([artist, count]) => ({
        artist,
        count,
        size: Math.max(60, Math.min(120, count * 20)),
        color: `hsla(348, 83%, 47%, ${Math.min(0.3 + count * 0.1, 0.8)})`, // 使用 #db2626 的色相
        x: Math.random() * (containerRef.current?.clientWidth || 500),
        y: Math.random() * (containerRef.current?.clientHeight || 300),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2
      }))
      .sort((a, b) => b.count - a.count);
  };

  // 初始化气泡
  useEffect(() => {
    if (containerRef.current) {
      setBubbles(getArtistStats());
    }
  }, [performances]);

  // 更新气泡位置
  const updateBubbles = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const padding = 20;
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 16;
    lastUpdateTime.current = now;

    setBubbles(prevBubbles => {
      return prevBubbles.map(bubble => {
        let { x, y, vx, vy, size, phase = 0 } = bubble;

        // 添加轻微的浮动效果
        phase = (phase + 0.02) % (Math.PI * 2);
        y += Math.sin(phase) * 0.2;

        // 边界检测
        if (x + size > containerWidth - padding) {
          x = containerWidth - size - padding;
          vx *= -0.8;
        } else if (x < padding) {
          x = padding;
          vx *= -0.8;
        }

        if (y + size > containerHeight - padding) {
          y = containerHeight - size - padding;
          vy *= -0.8;
        } else if (y < padding) {
          y = padding;
          vy *= -0.8;
        }

        // 阻尼
        vx *= 0.98;
        vy *= 0.98;

        // 更新位置
        x += vx * deltaTime;
        y += vy * deltaTime;

        return { ...bubble, x, y, vx, vy, phase };
      });
    });

    if (isAnimating.current) {
      animationFrameRef.current = requestAnimationFrame(updateBubbles);
    }
  };

  // 开始动画
  useEffect(() => {
    isAnimating.current = true;
    updateBubbles();
    return () => {
      isAnimating.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bubbles.length]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg bg-black/20"
    >
      {bubbles.map((bubble) => (
        <button
          key={bubble.artist}
          onClick={() => onArtistClick(bubble.artist)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            left: bubble.x + bubble.size / 2,
            top: bubble.y + bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
          }}
        >
          <div className="text-center p-2">
            <div className="font-medium text-white truncate px-2">
              {bubble.artist}
            </div>
            <div className="text-xs text-white/80">
              {bubble.count}场演出
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default PerformanceGrid; 