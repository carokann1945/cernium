import { cacheTag, cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/client';
import { filterByGameVersion, type GameVersion } from '../../game-version/model/game-version';
import type { Maintenance } from '../types/maintenance';

export const MAINTENANCE_CACHE_TAG = 'maintenance' as const;

type RawRow = {
  id: string;
  name: string;
  is_mscw: boolean | null;
  live_date: string | null;
  start_at: string | null;
  end_at: string | null;
  url: string | null;
};

function normalizeIso(s: string | null): string | null {
  if (s == null) return null;
  return s.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00');
}

export async function fetchMaintenance(gameVersion: GameVersion): Promise<Maintenance[] | null> {
  'use cache';
  cacheTag(MAINTENANCE_CACHE_TAG);
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('maintenance_v2').select('*').order('live_date', { ascending: false });
  if (error) {
    console.error('[maintenance] Supabase query failed:', error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const normalized = (data as RawRow[]).map((row) => ({
    ...row,
    live_date: normalizeIso(row.live_date),
    start_at: normalizeIso(row.start_at),
    end_at: row.end_at ? normalizeIso(row.end_at) : null,
  }));

  return filterByGameVersion(normalized, gameVersion);
}
