import { cacheTag, cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/client';
import { filterByGameVersion, type GameVersion } from '../../game-version/model/game-version';
import type { News } from '../types/news';

export const NEWS_CACHE_TAG = 'news' as const;

export async function fetchNews(gameVersion: GameVersion): Promise<News[] | null> {
  'use cache';
  cacheTag(NEWS_CACHE_TAG);
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('news').select('*').order('live_date', { ascending: false });

  if (error) {
    console.error('[news] Supabase query failed:', error.message);
    return null;
  }

  return data ? filterByGameVersion(data as News[], gameVersion) : null;
}
