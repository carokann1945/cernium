import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { EVENT_CACHE_TAG } from '@/features/event/model/fetch-event';
import { MAINTENANCE_CACHE_TAG } from '@/features/maintenance/model/fetch-maintenance';
import { NEWS_CACHE_TAG } from '@/features/news/model/fetch-news';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag(EVENT_CACHE_TAG, { expire: 0 });
  revalidateTag(MAINTENANCE_CACHE_TAG, { expire: 0 });
  revalidateTag(NEWS_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tags: [EVENT_CACHE_TAG, MAINTENANCE_CACHE_TAG, NEWS_CACHE_TAG] });
}
