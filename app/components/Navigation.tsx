'use client';
import React, { useState } from 'react';
import { Link } from '@/types';

interface NavigationProps {
  links: Link[];
  categories: string[];
}

export default function Navigation({ links, categories }: NavigationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex relative bg-gray-50 dark:bg-gray-900">
      {/* 移动端菜单按钮 */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-lg"
      >
        {/* 按钮内容保持不变 */}
      </button>

      {/* 其余 JSX 保持不变 */}
    </div>
  );
} 