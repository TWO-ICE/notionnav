import { getLinks, getDatabaseInfo, getConfig } from '../lib/notion';
import Navigation from './components/Navigation';

export const metadata = {
  title: '导航站',
  description: '个人导航站',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
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
    console.log('现有分类:', Array.from(new Set(links.map(l => l.category))));
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
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;
      
      // 如果都没有排序值，按时间排序
      const timeA = new Date(a.created_time).getTime();
      const timeB = new Date(b.created_time).getTime();
      return timeA - timeB;
    });

    console.log('排序前:', Array.from(new Set(links.map(l => `${l.category}(${categoryOrder[l.category] ?? "未配置"})`))));
    console.log('排序后:', Array.from(new Set(sortedLinks.map(l => `${l.category}(${categoryOrder[l.category] ?? "未配置"})`))));
    console.groupEnd();

    return (
      <main>
        <Navigation links={sortedLinks} icon={icon} cover={cover} />
      </main>
    );
  } catch (error) {
    console.error('❌ 错误:', error);
    throw error;
  }
} 