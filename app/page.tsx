import { Metadata } from 'next';
import { getLinks } from '@/lib/notion';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: '导航站',
  description: '个人导航站',
};

export default async function Home() {
  const links = await getLinks();
  
  return (
    <Navigation 
      links={links}
      icon="/logo.png"
      cover="/cover.jpg"
    />
  );
} 