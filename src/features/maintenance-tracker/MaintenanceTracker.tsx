import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import { pad } from '@/lib/utils';
import { getCachedMaintenances } from './model/maintenances';
import type { MaintenanceWithStatus } from './types/maintenance';
import MaintenanceBanner from './ui/MaintenanceBanner';

const KST = 'Asia/Seoul';
const DAY_ABBRS = ['월', '화', '수', '목', '금', '토', '일'] as const;

function isUpcoming(endIso: string, now: Temporal.ZonedDateTime): boolean {
  try {
    const endZdt = Temporal.Instant.from(endIso).toZonedDateTimeISO('UTC');
    return Temporal.ZonedDateTime.compare(endZdt, now) > 0;
  } catch {
    return false;
  }
}

function getStatus(startIso: string, nowInstant: Temporal.Instant): '점검 진행중' | '점검 예정' {
  try {
    const start = Temporal.Instant.from(startIso);
    return Temporal.Instant.compare(start, nowInstant) <= 0 ? '점검 진행중' : '점검 예정';
  } catch {
    return '점검 예정';
  }
}

function formatZdt(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

function formatPeriodKst(startIso: string, endIso: string): string {
  try {
    const start = Temporal.Instant.from(startIso).toZonedDateTimeISO(KST);
    const end = Temporal.Instant.from(endIso).toZonedDateTimeISO(KST);

    return `${formatZdt(start)} ~ ${formatZdt(end)}`;
  } catch {
    return '기간 정보 없음';
  }
}

export default async function MaintenanceTracker() {
  await connection();
  const maintenances = await getCachedMaintenances();

  if (maintenances === null) {
    return <p className={cn('w-full', 'mt-2', 'text-center', 'text-sm')}>점검 데이터를 불러오지 못했습니다. (500)</p>;
  }

  // 현재 시각은 서버에서 한 번만 구하기
  const nowZdt = Temporal.Now.zonedDateTimeISO('UTC');
  const nowInstant = nowZdt.toInstant();

  // '점검 진행중' | '점검 예정' 정보를 포함한 점검 정보 만들기
  const upcoming: MaintenanceWithStatus[] = maintenances
    .filter((m) => isUpcoming(m.end_at, nowZdt))
    .map((m) => ({
      ...m,
      status: getStatus(m.start_at, nowInstant),
      periodKst: formatPeriodKst(m.start_at, m.end_at), // 서버에서 미리 계산
    }))
    .sort((a, b) => b.source_index - a.source_index); // source_index 내림차순으로 정렬

  return (
    <>
      <MaintenanceBanner upcoming={upcoming} />
    </>
  );
}
