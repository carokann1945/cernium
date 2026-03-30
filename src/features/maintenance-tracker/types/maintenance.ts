export interface Maintenance {
  id: string;
  name: string;
  start_at: string; // ISO UTC, e.g. "2026-03-26T12:00:00Z"
  end_at: string | null; // ISO UTC, null이면 종료 시간 미정
  url: string;
  source_index: number;
}

export type MaintenanceWithStatus = Maintenance & {
  status: '점검 진행중' | '점검 예정';
  periodKst: string;
};
