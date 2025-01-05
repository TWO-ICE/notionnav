import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const NOTION_SECRET = process.env.NOTION_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const headersList = headers();
  const signature = headersList.get('x-notion-signature');

  // 验证请求是否来自 Notion
  if (!signature || signature !== NOTION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 重新验证首页
    revalidatePath('/');
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
} 