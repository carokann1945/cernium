import { cacheTag, cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/client';
import type { Maintenance } from '../types/maintenance';

export const MAINTENANCES_CACHE_TAG = 'maintenances' as const;

export async function getCachedMaintenances(): Promise<Maintenance[] | null> {
  'use cache';
  cacheTag(MAINTENANCES_CACHE_TAG);
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('maintenance').select('*').order('source_index', { ascending: false });
  if (error) {
    console.error('[maintenances] Supabase query failed:', error.message);
    return null;
  }
  return (data as Maintenance[]) ?? null;
}
