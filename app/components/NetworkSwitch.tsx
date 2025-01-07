'use client';

import { useState, useEffect } from 'react';

interface NetworkSwitchProps {
  collapsed?: boolean;
}

export default function NetworkSwitch({ collapsed = false }: NetworkSwitchProps) {
  const [isLAN, setIsLAN] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('networkMode');
    setIsLAN(savedMode === 'lan');
  }, []);

  // 如果还没有挂载，返回一个占位符
  if (!mounted) {
    return (
      <button className="flex items-center justify-center w-full px-4 py-2.5 text-gray-600 dark:text-gray-300">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </button>
    );
  }

  const toggleNetwork = () => {
    const newMode = !isLAN;
    setIsLAN(newMode);
    localStorage.setItem('networkMode', newMode ? 'lan' : 'wan');
    window.dispatchEvent(new CustomEvent('networkModeChange', { detail: newMode }));
  };

  return (
    <button
      onClick={toggleNetwork}
      title={isLAN ? '切换到外网' : '切换到内网'}
      className="flex items-center justify-center w-full px-4 py-2.5 text-gray-600 dark:text-gray-300 
                 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-500/10
                 hover:text-blue-500 dark:hover:text-blue-400
                 group transition-all rounded-lg"
    >
      {isLAN ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )}
    </button>
  );
} 