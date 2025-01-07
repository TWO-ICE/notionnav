import { Client } from '@notionhq/client';
import { 
  PageObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse,
  QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints';

// 验证环境变量
const requiredEnvVars = {
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NOTION_CONFIG_DATABASE_ID: process.env.NOTION_CONFIG_DATABASE_ID,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) throw new Error(`${key} is not defined`);
});

// 初始化 Notion 客户端
const notion = new Client({ auth: requiredEnvVars.NOTION_API_KEY });

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

// 类型守卫
function isPageObject(
  response: PageObjectResponse | PartialPageObjectResponse
): response is PageObjectResponse {
  return 'properties' in response;
}

// API 函数
export async function getConfig(): Promise<ConfigItem[]> {
  try {
    const response = await notion.databases.query({
      database_id: requiredEnvVars.NOTION_CONFIG_DATABASE_ID!,
      filter: {
        property: "type",
        select: {
          equals: "order"
        }
      },
      sorts: [{ property: "value", direction: "ascending" }]
    });

    return response.results
      .filter(isPageObject)
      .map(page => {
        try {
          const props = page.properties as NotionConfigProperties;
          const type = props.type?.select?.name;
          const title = props.title?.title?.[0]?.plain_text;
          const value = props.value?.number;

          if (!type || !title) return null;

          return {
            type: type as 'order' | 'url_order',
            title: title.trim(),
            value: value ?? 999
          };
        } catch (err) {
          console.error('Error processing config page:', page.id, err);
          return null;
        }
      })
      .filter((item): item is ConfigItem => item !== null);
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return [];
  }
}

export async function getDatabaseInfo() {
  try {
    const response = await notion.databases.retrieve({
      database_id: requiredEnvVars.NOTION_DATABASE_ID!
    });

    const database = response as DatabaseObjectResponse;
    
    return {
      icon: database.icon?.type === 'external' ? database.icon.external.url : 
            database.icon?.type === 'file' ? database.icon.file.url : undefined,
      cover: database.cover?.type === 'external' ? database.cover.external.url :
             database.cover?.type === 'file' ? database.cover.file.url : undefined
    };
  } catch (error) {
    console.error('Failed to fetch database info:', error);
    return { icon: undefined, cover: undefined };
  }
}

export async function getLinks(): Promise<Link[]> {
  try {
    const response = await notion.databases.query({
      database_id: requiredEnvVars.NOTION_DATABASE_ID!,
      sorts: [{ property: 'created_time', direction: 'ascending' }]
    });

    return response.results
      .filter(isPageObject)
      .map(page => {
        try {
          const props = page.properties as any;
          return {
            id: page.id,
            title: props.title?.title?.[0]?.plain_text ?? '',
            description: props.description?.rich_text?.[0]?.plain_text ?? '',
            category: props.category?.select?.name ?? '未分类',
            icon: props.icon?.files?.[0]?.file?.url ?? '',
            link: props.link?.url ?? '',
            created_time: page.created_time
          };
        } catch (err) {
          console.error('Error processing link page:', page.id, err);
          return null;
        }
      })
      .filter((link): link is Link => link !== null);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return [];
  }
} 