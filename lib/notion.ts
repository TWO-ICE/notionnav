import { Client } from '@notionhq/client';
import { DatabaseObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getLinks() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  return response.results.map((page) => {
    const pageObj = page as PageObjectResponse;
    return {
      id: pageObj.id,
      title: pageObj.properties.title?.title[0]?.plain_text || '',
      description: pageObj.properties.desp?.rich_text[0]?.plain_text || '',
      category: pageObj.properties.cat?.select?.name || '',
      icon: pageObj.properties.icon?.files[0]?.file?.url || 
            pageObj.properties.icon?.files[0]?.external?.url || '',
      link: pageObj.properties.link?.url || '',
    };
  });
}

export async function getDatabaseInfo() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!
  }) as DatabaseObjectResponse;

  const icon = database.icon;
  const cover = database.cover;

  return {
    icon: icon?.type === 'external' ? icon.external.url : 
          icon?.type === 'file' ? icon.file.url : undefined,
    cover: cover?.type === 'external' ? cover.external.url :
           cover?.type === 'file' ? cover.file.url : undefined
  };
} 