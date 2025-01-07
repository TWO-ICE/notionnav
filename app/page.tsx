import { getLinks, getDatabaseInfo, getConfig } from '@/lib/notion';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';

// 强制动态渲染
export const dynamic = 'force-dynamic';

// 错误边界
export function ErrorBoundaryPage() {
  return (
    <ErrorBoundary
      error={new Error('加载出错，请稍后重试')}
      reset={() => window.location.reload()}
    />
  );
}

export default async function Home() {
  try {
    console.group('🔄 初始化数据');
    const [links, { icon, cover }, config] = await Promise.all([
      getLinks(),
      getDatabaseInfo(),
      getConfig()
    ]);
    console.groupEnd();

    console.group('📋 配置信息');
    // 创建分类排序映射
    const categoryOrder = config.reduce<Record<string, number>>((acc, item) => {
      if (item.type === 'order') {
        acc[item.title] = item.value;
      }
      return acc;
    }, {});

    console.log('分类排序配置:', categoryOrder);
    console.log('现有分类:', [...new Set(links.map(l => l.category))]);
    console.groupEnd();

    console.group('🔀 排序过程');
    // 对链接进行排序
    const sortedLinks = [...links].sort((a, b) => {
      const catA = a.category.trim();
      const catB = b.category.trim();
      
      // 获取分类的排序值
      const orderA = categoryOrder[catA];
      const orderB = categoryOrder[catB];

      console.log(`比较分类: "${catA}" (${orderA}) vs "${catB}" (${orderB})`);

      // 如果两个分类都有排序值
      if (orderA !== undefined && orderB !== undefined) {
        return orderA - orderB;
      }
      // 如果只有一个分类有排序值
      if (orderA !== undefined) return -1;  // A 有排序值，排在前面
      if (orderB !== undefined) return 1;   // B 有排序值，排在前面
      
      // 如果都没有排序值，按时间排序
      const timeA = new Date(a.created_time).getTime();
      const timeB = new Date(b.created_time).getTime();
      return timeA - timeB;
    });

    // 打印排序结果
    console.log('排序前:', [...new Set(links.map(l => `${l.category}(${categoryOrder[l.category] ?? "未配置"})`))]); 
    console.log('排序后:', [...new Set(sortedLinks.map(l => `${l.category}(${categoryOrder[l.category] ?? "未配置"})`))]); 
    console.groupEnd();

    return (
      <main>
        <Navigation links={sortedLinks} icon={icon} cover={cover} />
      </main>
    );
  } catch (error) {
    console.error('❌ 错误:', error);
    return <ErrorBoundaryPage />;
  }
} 