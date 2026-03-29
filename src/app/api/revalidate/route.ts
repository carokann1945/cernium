import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { MAINTENANCES_CACHE_TAG } from '@/features/maintenance-tracker/model/maintenances';
import { EVENTS_CACHE_TAG } from '@/features/period-tracker/model/events';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag(EVENTS_CACHE_TAG, { expire: 0 });
  revalidateTag(MAINTENANCES_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tags: [EVENTS_CACHE_TAG, MAINTENANCES_CACHE_TAG] });
}
