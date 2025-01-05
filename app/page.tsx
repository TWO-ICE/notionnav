'use client';
import React, { useState } from 'react';
import { getLinks } from '@/lib/notion';

interface Link {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
}

export const revalidate = 60; // 每60秒重新验证

export default async function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const links = await getLinks();
  const categories = Array.from(new Set(links.map(link => link.category)));

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
        <svg
          className="w-6 h-6 dark:text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 左侧分类导航 */}
      <aside
        className={`
          w-64 fixed h-screen overflow-y-auto border-r dark:border-gray-700/50
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hide-scrollbar 
          transition-transform duration-300 ease-in-out z-40
          lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-lg
        `}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            导航分类
          </h2>
          <nav>
            <ul className="space-y-1">
              {categories.map(category => (
                <li key={category}>
                  <a
                    href={`#${category}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block py-2.5 px-4 rounded-lg transition-all duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-gray-200
                    hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* 遮罩层 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 主内容区 */}
      <main className="w-full min-h-screen p-6 lg:p-8 dark:text-gray-100 lg:ml-64 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              导航站
            </span>
          </h1>
          
          {categories.map(category => (
            <div key={category} className="mb-12" id={category}>
              <h2 className="text-2xl font-bold mb-6 dark:text-gray-200 flex items-center gap-2">
                <span className="h-6 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"/>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {links
                  .filter(link => link.category === category)
                  .map((link: Link) => (
                    <a
                      key={link.id}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl 
                      transition-all duration-300 border border-gray-200 dark:border-gray-700/50
                      hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3">
                        {link.icon ? (
                          <img 
                            src={link.icon} 
                            alt={link.title} 
                            className="w-10 h-10 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {link.title[0]}
                          </div>
                        )}
                        <h3 className="font-semibold dark:text-gray-100 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {link.title}
                        </h3>
                      </div>
                      {link.description && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {link.description}
                        </p>
                      )}
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