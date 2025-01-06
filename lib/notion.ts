import { Client } from '@notionhq/client';
import { 
  DatabaseObjectResponse, 
  PageObjectResponse,
  RichTextItemResponse,
  SelectPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
  FilesPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 导出 Link 接口以供其他文件使用
export interface Link {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
}

interface NotionProperties {
  title: TitlePropertyItemObjectResponse;
  desp: { type: "rich_text"; rich_text: Array<RichTextItemResponse> };
  cat: SelectPropertyItemObjectResponse;
  icon: FilesPropertyItemObjectResponse;
  link: UrlPropertyItemObjectResponse;
}

export async function getLinks(): Promise<Link[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    const links = response.results.map((page) => {
      try {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as unknown as NotionProperties;

        const link: Link = {
          id: pageObj.id,
          title: properties.title.title[0]?.plain_text || '',
          description: properties.desp.rich_text[0]?.plain_text || '',
          category: properties.cat.select?.name || '',
          icon: properties.icon.files[0]?.file?.url || properties.icon.files[0]?.external?.url || '',
          link: properties.link.url || '',
        };

        return link;
      } catch (error) {
        console.error('Error processing page:', error);
        return null;
      }
    }).filter((link): link is Link => link !== null);

    return links;
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

export async function getDatabaseInfo() {
  try {
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!
    }) as DatabaseObjectResponse;

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