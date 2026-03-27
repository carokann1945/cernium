import { cacheTag, cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '../types/event';

export const EVENTS_CACHE_TAG = 'events' as const;

export async function getCachedEvents(): Promise<Event[] | null> {
  'use cache';
  console.log('[events] DB query 실행됨');
  cacheTag(EVENTS_CACHE_TAG);
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('events').select('*');

  if (error) {
    console.error('[events] Supabase query failed:', error.message);
    return null;
  }
  return (data as Event[]) ?? null;
}
