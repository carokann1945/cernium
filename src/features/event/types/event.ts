export interface Event {
  id: string;
  name: string;
  is_mscw: boolean | null;
  live_date: string | null;
  start_at: string | null;
  end_at: string | null;
  gms_url: string | null;
  image_thumbnail: string | null;
  summary: string | null;
}

export interface OngoingEventView {
  id: string;
  name: string;
  live_date: string | null;
  image_thumbnail: string | null;
  gms_url: string | null;
  summary: string | null;
  periodKst: string;
  startAtIso: string; // UTC ISO e.g. "2026-03-18T00:00:00Z"
  endAtIso: string; // UTC ISO e.g. "2026-03-19T00:00:00Z"
}

export type SortOrder = 'latest' | 'deadline';
