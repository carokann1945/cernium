export interface Maintenance {
  id: string;
  name: string;
  start_at: string; // ISO UTC, e.g. "2026-03-26T12:00:00Z"
  end_at: string; // ISO UTC
  url: string;
  source_index: number;
}
