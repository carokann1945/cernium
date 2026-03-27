import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { EVENTS_CACHE_TAG } from '@/features/period-tracker/model/events';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('[revalidate] webhook arrived');

  const secret = request.nextUrl.searchParams.get('secret');
  console.log('[revalidate] secret exists:', Boolean(secret));

  if (!process.env.REVALIDATION_SECRET) {
    console.error('[revalidate] missing env');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    console.error('[revalidate] invalid secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log('[revalidate] invalidating tag:', EVENTS_CACHE_TAG);
  revalidateTag(EVENTS_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: EVENTS_CACHE_TAG });
}
