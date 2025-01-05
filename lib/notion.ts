import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

type NotionProperties = {
  title: {
    type: 'title';
    title: Array<{ plain_text: string }>;
  };
  desp: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
  cat: {
    type: 'select';
    select: { name: string } | null;
  };
  icon: {
    type: 'files';
    files: Array<{
      file?: { url: string };
      external?: { url: string };
    }>;
  };
  link: {
    type: 'url';
    url: string | null;
  };
};

export async function getLinks() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  const pages = response.results.filter((page): page is PageObjectResponse => 'properties' in page);

  const links = pages.map((page) => {
    const props = page.properties as unknown as NotionProperties;
    return {
      id: page.id,
      title: props.title.title[0]?.plain_text || '',
      description: props.desp.rich_text[0]?.plain_text || '',
      category: props.cat.select?.name || '',
      icon: props.icon.files[0]?.file?.url || props.icon.files[0]?.external?.url || '',
      link: props.link.url || '',
    };
  });

  return links;
} 