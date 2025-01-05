import { getLinks } from '@/lib/notion';
import Navigation from './components/Navigation';

export const revalidate = 60;

export default async function Home() {
  const links = await getLinks();
  const categories = Array.from(new Set(links.map(link => link.category)));

  return <Navigation links={links} categories={categories} />;
} 