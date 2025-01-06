import { getLinks, getDatabaseInfo } from '@/lib/notion';
import Navigation from './components/Navigation';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default async function Home() {
  const links = await getLinks();
  const { icon, cover } = await getDatabaseInfo();
  
  return (
    <main>
      <Navigation links={links} icon={icon} cover={cover} />
    </main>
  );
} 