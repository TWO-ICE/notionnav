import { Client } from '@notionhq/client';
import { 
  DatabaseObjectResponse, 
  PageObjectResponse,
  RichTextItemResponse,
  SelectPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  URLPropertyItemObjectResponse,
  FilesPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

interface NotionProperties {
  title: TitlePropertyItemObjectResponse;
  desp: { type: "rich_text"; rich_text: Array<RichTextItemResponse> };
  cat: SelectPropertyItemObjectResponse;
  icon: FilesPropertyItemObjectResponse;
  link: URLPropertyItemObjectResponse;
}

export async function getLinks() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  return response.results.map((page) => {
    const pageObj = page as PageObjectResponse;
    const properties = pageObj.properties as unknown as NotionProperties;

    return {
      id: pageObj.id,
      title: properties.title.title[0]?.plain_text || '',
      description: properties.desp.rich_text[0]?.plain_text || '',
      category: properties.cat.select?.name || '',
      icon: properties.icon.files[0]?.file?.url || properties.icon.files[0]?.external?.url || '',
      link: properties.link.url || '',
    };
  });
}

export async function getDatabaseInfo() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!
  }) as DatabaseObjectResponse;

  return {
    icon: database.icon?.type === 'external' ? database.icon.external.url : 
          database.icon?.type === 'file' ? database.icon.file.url : undefined,
    cover: database.cover?.type === 'external' ? database.cover.external.url :
           database.cover?.type === 'file' ? database.cover.file.url : undefined
  };
} 