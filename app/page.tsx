import { getLinks, getDatabaseInfo } from '@/lib/notion';
import Navigation from './components/Navigation';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const [links, { icon, cover }] = await Promise.all([
      getLinks(),
      getDatabaseInfo()
    ]);
    
    return (
      <main>
        <Navigation links={links} icon={icon} cover={cover} />
      </main>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">加载出错，请稍后重试</p>
      </main>
    );
  }
} 