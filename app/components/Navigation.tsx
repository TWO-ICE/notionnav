'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/notion';
import NetworkSwitch from './NetworkSwitch';

interface NavigationProps {
  links: Link[];
  icon?: string;
  cover?: string;
}

export default function Navigation({ links, icon, cover }: NavigationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLAN, setIsLAN] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 初始化状态
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('networkMode');
    setIsLAN(savedMode === 'lan');
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'list' || savedViewMode === 'grid') {
      setViewMode(savedViewMode);
    }
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    setIsSidebarCollapsed(savedSidebarState === 'true');
  }, []);

  // 监听网络模式变化
  useEffect(() => {
    if (!mounted) return;

    const handleNetworkChange = (e: CustomEvent<boolean>) => {
      setIsLAN(e.detail);
    };

    window.addEventListener('networkModeChange', handleNetworkChange as EventListener);
    return () => {
      window.removeEventListener('networkModeChange', handleNetworkChange as EventListener);
    };
  }, [mounted]);

  // 切换视图模式
  const toggleViewMode = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    if (mounted) {
      localStorage.setItem('viewMode', newMode);
    }
  };

  // 切换侧边栏状态
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', (!isSidebarCollapsed).toString());
    }
  };

  // 获取实际使用的链接
  const getActualLink = (link: Link) => {
    if (!mounted) return link.link;
    return isLAN && link.lanlink ? link.lanlink : link.link;
  };

  // 搜索和分组逻辑
  const filteredLinks = links.filter(link => {
    const searchContent = `${link.title} ${link.description} ${link.category}`.toLowerCase();
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term);
    return searchTerms.length === 0 || searchTerms.every(term => searchContent.includes(term));
  });

  const groupedLinks = filteredLinks.reduce((groups, link) => {
    const category = link.category || '未分类';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(link);
    return groups;
  }, {} as Record<string, Link[]>);

  return (
    <div className="flex bg-[#f7f7f7] dark:bg-gray-900 min-h-screen">
      {/* 侧边栏背景遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-30 backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* 收起状态的展开按钮 - 左下角显示 */}
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          title="展开侧边栏"
          className="fixed left-0 bottom-4 z-40 
                   bg-white dark:bg-gray-800 shadow-lg
                   p-2 rounded-r-lg
                   text-gray-600 dark:text-gray-300 
                   hover:text-blue-500 dark:hover:text-blue-400
                   hover:shadow-md 
                   transition-all"
        >
          <svg
            className="w-5 h-5 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 侧边栏 */}
      {!isSidebarCollapsed && (
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          transition-all duration-300 ease-in-out
          w-64 lg:translate-x-0 bg-white dark:bg-gray-800 shadow-lg
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo区域 */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
              <a 
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {icon && (
                  <img src={icon} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                )}
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  导航站
                </h1>
              </a>
            </div>

            {/* 分类导航 */}
            <nav className="flex flex-col h-full">
              <ul className="flex-1 overflow-y-auto py-6 space-y-1 px-3 overflow-y-auto scrollbar-none">
                {Object.keys(groupedLinks).map(category => (
                  <li key={category}>
                    <a
                      href={`#${category}`}
                      onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                      className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 
                               hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-500/10
                               group transition-all"
                      title={category}
                    >
                      <span className="flex-1 text-sm font-medium truncate">
                        {category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10
                                   text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20">
                        {groupedLinks[category].length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* 功能按钮区域 */}
              <div className="p-3 mt-auto border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <NetworkSwitch />
                  <button
                    onClick={toggleViewMode}
                    title={viewMode === 'grid' ? '切换到列表视图' : '切换到网格视图'}
                    className="flex items-center justify-center p-2.5 text-gray-600 dark:text-gray-300 
                             hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-500/10
                             hover:text-blue-500 dark:hover:text-blue-400
                             group transition-all rounded-lg"
                  >
                    {viewMode === 'grid' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={toggleSidebar}
                    title="收起侧边栏"
                    className="flex items-center justify-center p-2.5 text-gray-600 dark:text-gray-300 
                             hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-500/10
                             hover:text-blue-500 dark:hover:text-blue-400
                             group transition-all rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </aside>
      )}

      {/* 主内容区 */}
      <main className={`
        flex-1 min-w-0 transition-all duration-300
        ${isSidebarCollapsed ? 'ml-0' : 'lg:ml-0'}
      `}>
        {/* 封面图和搜索栏 */}
        <div className="relative">
          {cover && (
            <div className="h-48 lg:h-64 overflow-hidden">
              <img src={cover} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`
            max-w-screen-xl mx-auto px-4 
            ${cover ? '-mt-8' : 'mt-4'}
          `}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索导航..."
                className="w-full h-12 pl-12 pr-4 rounded-xl text-sm 
                         bg-white/90 dark:bg-gray-800/90 
                         border border-gray-200/50 dark:border-gray-700/50
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30
                         shadow-lg backdrop-blur-sm
                         dark:text-gray-200 dark:placeholder-gray-400
                         transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 链接卡片区域 */}
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
            <div key={category} id={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                {category}
              </h2>
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'
                }
              `}>
                {categoryLinks.map(link => (
                  <a
                    key={link.id}
                    href={getActualLink(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group transition-all duration-300
                      ${viewMode === 'grid'
                        ? `flex items-center p-3 rounded-xl
                           border border-gray-100 dark:border-gray-700
                           hover:shadow-lg hover:shadow-blue-500/5
                           hover:border-blue-500/50 dark:hover:border-blue-500/50
                           bg-gradient-to-br from-gray-50 to-white
                           dark:from-gray-800 dark:to-gray-750
                           hover:from-blue-50/50 hover:to-white
                           dark:hover:from-blue-500/10 dark:hover:to-gray-750`
                        : `flex items-center p-2.5 rounded-lg
                           border border-transparent
                           hover:bg-gray-50 dark:hover:bg-gray-700/50
                           hover:border-gray-200 dark:hover:border-gray-600`
                      }
                    `}
                  >
                    <div className="flex-shrink-0">
                      {link.icon ? (
                        <img 
                          src={link.icon} 
                          alt=""
                          className={`
                            rounded-lg shadow-sm transition-all duration-300
                            ${viewMode === 'grid' ? 'w-10 h-10' : 'w-9 h-9'}
                            group-hover:scale-110 group-hover:shadow-md
                          `}
                        />
                      ) : (
                        <div className={`
                          rounded-lg bg-gradient-to-br from-gray-100 to-gray-50
                          dark:from-gray-700 dark:to-gray-600
                          flex items-center justify-center shadow-sm
                          group-hover:scale-110 group-hover:shadow-md
                          transition-all duration-300
                          ${viewMode === 'grid' ? 'w-10 h-10' : 'w-9 h-9'}
                        `}>
                          <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
                            {link.title[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <h3 className={`
                        font-medium text-gray-900 dark:text-white truncate
                        ${viewMode === 'grid' ? 'text-sm' : 'text-base'}
                        group-hover:text-blue-500
                      `}>
                        {link.title}
                      </h3>
                      <p className={`
                        text-gray-500 dark:text-gray-400 mt-0.5 truncate
                        ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}
                      `}>
                        {link.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 