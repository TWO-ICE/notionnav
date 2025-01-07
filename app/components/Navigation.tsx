'use client';

import React, { useState } from 'react';
import { Link } from '@/lib/notion';

interface NavigationProps {
  links: Link[];
  icon?: string;
  cover?: string;
}

export default function Navigation({ links, icon, cover }: NavigationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const categories = Array.from(new Set(links.map(link => link.category)));
  
  // 搜索逻辑
  const filteredLinks = links.filter(link => {
    const searchContent = `${link.title} ${link.description} ${link.category}`.toLowerCase();
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term);
    
    return searchTerms.length === 0 || 
      searchTerms.every(term => searchContent.includes(term));
  });

  const groupedLinks = filteredLinks.reduce((groups, link) => {
    if (!groups[link.category]) {
      groups[link.category] = [];
    }
    groups[link.category].push(link);
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

      {/* 侧边栏 */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen
        transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0 bg-white dark:bg-gray-800 shadow-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo区域 - 添加首页链接 */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
            <a 
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {icon && (
                <img 
                  src={icon} 
                  alt="Logo" 
                  className="w-8 h-8 rounded-lg shadow-sm"
                />
              )}
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                导航站
              </h1>
            </a>
          </div>

          {/* 分类导航 */}
          <nav className="flex-1 overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ul className="space-y-1 px-3">
              {categories.map(category => (
                <li key={category}>
                  <a
                    href={`#${category}`}
                    onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                    className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 
                             hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-500/10
                             group transition-all"
                  >
                    <span className="flex-1 text-sm font-medium">{category}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10
                                   text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20">
                      {links.filter(link => link.category === category).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 
                  shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0">
        {/* 封面图和搜索栏 */}
        <div className="relative">
          {/* 封面图 */}
          {cover && (
            <div className="relative h-48 lg:h-64 w-full overflow-hidden">
              <img 
                src={cover} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f7f7]/50 to-[#f7f7f7] 
                            dark:from-transparent dark:via-gray-900/50 dark:to-gray-900" />
              
              {/* 搜索栏 - 悬浮在封面上 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索导航..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl text-sm 
                             bg-white/95 dark:bg-gray-800/95 
                             border border-gray-200/50 dark:border-gray-700/50
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30
                             shadow-lg backdrop-blur-sm
                             dark:text-gray-200 dark:placeholder-gray-400"
                  />
                  <svg
                    className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 无封面时的搜索栏 */}
          {!cover && (
            <div className="sticky top-0 z-10 bg-gradient-to-b from-[#f7f7f7] via-[#f7f7f7]/80 to-transparent 
                          dark:from-gray-900 dark:via-gray-900/80 pb-16 pt-6">
              <div className="max-w-2xl mx-auto px-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索导航..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl text-sm 
                             bg-white dark:bg-gray-800 
                             border border-gray-200 dark:border-gray-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30
                             shadow-lg"
                  />
                  <svg
                    className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 内容区 */}
        <div className="px-6 pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {Object.entries(groupedLinks).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">没有找到匹配的内容</p>
              </div>
            ) : (
              Object.entries(groupedLinks).map(([category, categoryLinks]) => (
                <section 
                  key={category}
                  id={category}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden
                           border border-gray-100 dark:border-gray-700"
                >
                  <div className="px-6 h-14 flex items-center bg-gradient-to-r from-gray-50 to-transparent
                                dark:from-gray-700/30 dark:to-transparent">
                    <h2 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="w-1 h-4 bg-blue-500 rounded-full mr-3"></span>
                      {category}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({categoryLinks.length})
                      </span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {categoryLinks.map(link => (
                        <a
                          key={link.id}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center p-3 rounded-xl
                                   border border-gray-100 dark:border-gray-700
                                   hover:shadow-lg hover:shadow-blue-500/5
                                   hover:border-blue-500/50 dark:hover:border-blue-500/50
                                   bg-gradient-to-br from-gray-50 to-white
                                   dark:from-gray-800 dark:to-gray-750
                                   hover:from-blue-50/50 hover:to-white
                                   dark:hover:from-blue-500/10 dark:hover:to-gray-750
                                   transition-all duration-300"
                        >
                          <div className="flex-shrink-0">
                            {link.icon ? (
                              <img 
                                src={link.icon} 
                                alt=""
                                className="w-10 h-10 rounded-lg shadow-sm group-hover:scale-110 group-hover:shadow-md
                                         transition-all duration-300" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50
                                            dark:from-gray-700 dark:to-gray-600
                                            flex items-center justify-center shadow-sm
                                            group-hover:scale-110 group-hover:shadow-md
                                            transition-all duration-300">
                                <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
                                  {link.title[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-3 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm
                                         group-hover:text-blue-500">
                              {link.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {link.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 