import type { Metadata } from 'next'
import { getLinks, getDatabaseInfo } from '@/lib/notion'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: '导航站',
  description: '个人导航站',
}

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [links, { icon, cover }] = await Promise.all([
    getLinks(),
    getDatabaseInfo(),
  ])

  return <Navigation links={links} icon={icon} cover={cover} />
} 