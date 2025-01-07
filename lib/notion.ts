import { Client } from '@notionhq/client';
import { 
  PageObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

// 确保环境变量存在
if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is not defined');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not defined');
}

if (!process.env.NOTION_CONFIG_DATABASE_ID) {
  throw new Error('NOTION_CONFIG_DATABASE_ID is not defined');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 类型定义
export interface Link {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
  created_time: string;
}

interface NotionConfigProperties {
  type: {
    select: { name: string } | null;
  };
  title: {
    title: Array<{ plain_text: string }>;
  };
  value: {
    number: number | null;
  };
}

interface ConfigItem {
  type: 'order' | 'url_order';
  title: string;
  value: number;
}

// 类型守卫函数
function isFullPage(page: PageObjectResponse | PartialPageObjectResponse): page is PageObjectResponse {
  return 'properties' in page;
}

// 获取配置信息
export async function getConfig(): Promise<ConfigItem[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CONFIG_DATABASE_ID!,
      filter: {
        property: "type",
        select: {
          equals: "order"
        }
      },
      sorts: [
        {
          property: "value",
          direction: "ascending"
        }
      ]
    });

    return response.results
      .filter(isFullPage)
      .map((page) => {
        const properties = page.properties as NotionConfigProperties;
        
        const type = properties.type?.select?.name;
        const title = properties.title?.title?.[0]?.plain_text;
        const value = properties.value?.number;

        if (!type || !title) {
          console.warn('Missing required properties:', { pageId: page.id });
          return null;
        }

        return {
          type: type as 'order' | 'url_order',
          title: title.trim(),
          value: value ?? 999
        };
      })
      .filter((item): item is ConfigItem => item !== null);
  } catch (error) {
    console.error('Error fetching config:', error);
    return [];
  }
}

// 获取数据库信息
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
    return { icon: undefined, cover: undefined };
  }
}

// 获取链接列表
export async function getLinks(): Promise<Link[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: 'created_time',
          direction: 'ascending',
        },
      ],
    });

    return response.results
      .filter(isFullPage)
      .map((page) => {
        const properties = page.properties as any;
        return {
          id: page.id,
          title: properties.title?.title?.[0]?.plain_text ?? '',
          description: properties.description?.rich_text?.[0]?.plain_text ?? '',
          category: properties.category?.select?.name ?? '未分类',
          icon: properties.icon?.files?.[0]?.file?.url ?? '',
          link: properties.link?.url ?? '',
          created_time: page.created_time,
        };
      });
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
} 