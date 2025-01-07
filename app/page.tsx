import { getLinks, getDatabaseInfo } from '@/lib/notion'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '导航站',
  description: '个人导航站',
}

export const dynamic = 'force-dynamic'

async function getData() {
  const [links, { icon, cover }] = await Promise.all([
    getLinks(),
    getDatabaseInfo(),
  ])
  return { links, icon, cover }
}

export default async function Page() {
  const { links, icon, cover } = await getData()
  return <Navigation links={links} icon={icon} cover={cover} />
} 