export interface Event {
  id: string;
  source_index: number;
  name: string;
  image_url: string | null;
  event_period: string | null;
  fetched_at: string;
  gms_url: string | null;
  kms_url: string | null;
}

export interface OngoingEventView {
  id: string;
  name: string;
  source_index: number;
  image_url: string | null;
  gms_url: string | null;
  kms_url: string | null;
  periodKst: string;
  startAtIso: string; // UTC ISO e.g. "2026-02-04T00:00:00Z"
  endAtIso: string; // UTC ISO e.g. "2026-02-05T00:00:00Z"
}

export type SortOrder = 'latest' | 'deadline';
