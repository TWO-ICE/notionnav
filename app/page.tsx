import { getLinks, getDatabaseInfo, getConfig } from '@/lib/notion';
import Navigation from './components/Navigation';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const [links, { icon, cover }, config] = await Promise.all([
      getLinks(),
      getDatabaseInfo(),
      getConfig()
    ]);
    
    // 处理分类排序配置
    const categoryOrders = config
      .filter(item => item.type === 'order')
      .reduce((acc, item) => ({
        ...acc,
        [item.title]: item.value as number
      }), {} as Record<string, number>);

    // 获取链接排序配置
    const urlOrderConfig = config.find(
      item => item.type === 'url_order' && item.title === 'lasted'
    );
    const shouldReverseUrls = urlOrderConfig?.value === false;

    // 对链接进行排序
    const sortedLinks = [...links].sort((a, b) => {
      // 先按分类顺序排序
      const categoryOrderA = categoryOrders[a.category] || 999;
      const categoryOrderB = categoryOrders[b.category] || 999;
      if (categoryOrderA !== categoryOrderB) {
        return categoryOrderA - categoryOrderB;
      }

      // 同一分类内按时间排序
      if (shouldReverseUrls) {
        return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
      }
      return new Date(a.created_time).getTime() - new Date(b.created_time).getTime();
    });
    
    return (
      <main>
        <Navigation links={sortedLinks} icon={icon} cover={cover} />
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