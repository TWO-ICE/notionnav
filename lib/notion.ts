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

interface NotionConfigProperties {
  type: {
    type: "select";
    select: { name: string } | null;
  };
  title: {
    type: "title";
    title: Array<{ plain_text: string }>;
  };
  value: {
    type: "number";
    number: number | null;
  };
}

// 配置项类型
interface ConfigItem {
  type: 'order' | 'url_order';
  title: string;
  value: number;  // 对于 order 类型，这是排序值
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

    console.log('Raw response:', JSON.stringify(response.results[0]?.properties, null, 2));

    const configs = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const properties = page.properties as NotionConfigProperties;
        
        const type = properties.type?.select?.name;
        const title = properties.title?.title?.[0]?.plain_text;
        const value = properties.value?.number;

        console.log('Processing config:', {
          pageId: page.id,
          type,
          title,
          value
        });

        if (!type || !title) {
          console.warn('Missing required properties:', { pageId: page.id, type, title });
          return null;
        }

        return {
          type: type as 'order' | 'url_order',
          title: title.trim(),
          value: value ?? 999
        };
      })
      .filter((item): item is ConfigItem => item !== null);

    console.log('Final configs:', JSON.stringify(configs, null, 2));
    return configs;
  } catch (error) {
    console.error('Error fetching config:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
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