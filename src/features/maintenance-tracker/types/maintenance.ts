export interface Maintenance {
  id: string;
  name: string;
  live_date: string | null; // ISO UTC — 공지 게시일
  start_at: string | null; // ISO UTC
  end_at: string | null; // ISO UTC, null이면 종료 시간 미정
  url: string | null;
}

export type MaintenanceWithStatus = Maintenance & {
  status: '점검 진행중' | '점검 예정';
  periodKst: string;
};
