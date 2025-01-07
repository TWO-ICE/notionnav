import { Metadata } from 'next';
import { getLinks, getDatabaseInfo } from '@/lib/notion';
import Navigation from '@/components/Navigation';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '导航站',
  description: '个人导航站',
};

export default async function Home() {
  try {
    // 获取数据
    const [links, { icon, cover }] = await Promise.all([
      getLinks(),
      getDatabaseInfo(),
    ]);

    return (
      <Navigation 
        links={links}
        icon={icon}
        cover={cover}
      />
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            加载出错
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            请稍后重试
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }
} 