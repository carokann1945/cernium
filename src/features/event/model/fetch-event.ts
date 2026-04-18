import { cacheTag, cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/client';
import { filterByContentMode, type ContentMode } from '../../world-filter/model/content-mode';
import type { Event } from '../types/event';

export const EVENT_CACHE_TAG = 'events_v2' as const;

export async function fetchEvent(contentMode: ContentMode): Promise<Event[] | null> {
  'use cache';
  cacheTag(EVENT_CACHE_TAG);
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('events_v2').select('*').order('live_date', { ascending: false });

  if (error) {
    console.error('[events_v2] Supabase query failed:', error.message);
    return null;
  }

  return data ? filterByContentMode(data as Event[], contentMode) : null;
}
