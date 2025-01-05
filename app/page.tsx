'use client';
import React, { useState } from 'react';
import { getLinks } from '@/lib/notion';
import Navigation from './components/Navigation';
import { headers } from 'next/headers';

// 强制动态渲染
export const dynamic = 'force-dynamic';
// 禁用缓存
export const revalidate = 0;

interface Link {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
}

export default async function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const headersList = headers();
  const links = await getLinks();
  const categories = Array.from(new Set(links.map(link => link.category)));

  return <Navigation links={links} categories={categories} />;
} 