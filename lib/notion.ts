import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getLinks() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  const pages = response.results.filter((page): page is PageObjectResponse => 'properties' in page);

  console.log('First page properties:', (response.results[0] as PageObjectResponse)?.properties);

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.title.title[0]?.plain_text || '',
    description: page.properties.desp.rich_text[0]?.plain_text || '',
    category: page.properties.cat.select?.name || '',
    icon: page.properties.icon.files[0]?.file?.url || page.properties.icon.files[0]?.external?.url || '',
    link: page.properties.link.url || '',
  }));
} 