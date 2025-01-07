import { Client } from '@notionhq/client';
import { 
  PageObjectResponse,
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
  created_time: string;
}

// 配置项类型
interface ConfigItem {
  type: 'order' | 'url_order';
  title: string;
  value: string | number | boolean;
}

// 获取配置信息
export async function getConfig(): Promise<ConfigItem[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CONFIG_DATABASE_ID!,
    });

    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const properties = page.properties as any;
        return {
          type: properties.type?.select?.name || '',
          title: properties.title?.title?.[0]?.plain_text || '',
          value: properties.type?.select?.name === 'url_order' 
            ? properties.value?.checkbox || false
            : Number(properties.value?.number || 999),
        };
      });
  } catch (error) {
    console.error('Error fetching config:', error);
    return [];
  }
}

export async function getLinks(): Promise<Link[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        { timestamp: "created_time", direction: "ascending" }
      ]
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
            created_time: page.created_time,
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
    
    const database = response as DatabaseObjectResponse;
    
    return {
      icon: database.icon?.type === 'external' ? database.icon.external.url : 
            database.icon?.type === 'file' ? database.icon.file.url : undefined,
      cover: database.cover?.type === 'external' ? database.cover.external.url :
             database.cover?.type === 'file' ? database.cover.file.url : undefined
    };
  } catch (error) {
    console.error('Error fetching database info:', error);
    return {
      icon: undefined,
      cover: undefined
    };
  }
} 