import { getLinks, getDatabaseInfo, getConfig } from '@/lib/notion'
import Navigation from './components/Navigation'

export const metadata = {
  title: '导航站',
  description: '个人导航站',
}

export const dynamic = 'force-dynamic'

async function getData() {
  const [links, { icon, cover }, config] = await Promise.all([
    getLinks(),
    getDatabaseInfo(),
    getConfig(),
  ])

  console.log('Config received:', config)
  
  const categoryOrder = config.reduce<Record<string, number>>((acc, item) => {
    acc[item.title] = item.value
    console.log(`Setting order for ${item.title}: ${item.value}`)
    return acc
  }, {})

  console.log('Category order map:', categoryOrder)

  const sortedLinks = [...links].sort((a, b) => {
    const catA = a.category.trim()
    const catB = b.category.trim()
    
    const orderA = categoryOrder[catA] ?? 999
    const orderB = categoryOrder[catB] ?? 999

    console.log(`Comparing ${catA}(${orderA}) vs ${catB}(${orderB})`)
    return orderA - orderB
  })

  return { links: sortedLinks, icon, cover }
}

export default async function Page() {
  const { links, icon, cover } = await getData()
  return <Navigation links={links} icon={icon} cover={cover} />
} 