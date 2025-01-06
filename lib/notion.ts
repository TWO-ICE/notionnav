import { Client } from '@notionhq/client';
import { 
  PageObjectResponse,
  GetDatabaseResponse,
  DatabaseObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface Link {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
}

export async function getLinks(): Promise<Link[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    const links = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        try {
          const properties = page.properties as any;

          return {
            id: page.id,
            title: properties.title?.title?.[0]?.plain_text || '',
            description: properties.desp?.rich_text?.[0]?.plain_text || '',
            category: properties.cat?.select?.name || '',
            icon: properties.icon?.files?.[0]?.file?.url || 
                  properties.icon?.files?.[0]?.external?.url || '',
            link: properties.link?.url || '',
          };
        } catch (error) {
          console.error('Error processing page:', error);
          return null;
        }
      })
      .filter((link): link is Link => link !== null);

    return links;
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

export async function getDatabaseInfo() {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    
    // 类型断言为完整的数据库对象
    const database = response as DatabaseObjectResponse;

    // 处理图标
    let icon: string | undefined;
    if (database.icon?.type === 'external') {
      icon = database.icon.external.url;
    } else if (database.icon?.type === 'file') {
      icon = database.icon.file.url;
    }

    // 处理封面
    let cover: string | undefined;
    if (database.cover?.type === 'external') {
      cover = database.cover.external.url;
    } else if (database.cover?.type === 'file') {
      cover = database.cover.file.url;
    }

    return { icon, cover };
  } catch (error) {
    console.error('Error fetching database info:', error);
    return {
      icon: undefined,
      cover: undefined
    };
  }
} 