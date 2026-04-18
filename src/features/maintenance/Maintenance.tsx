import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { DAY_ABBRS } from '@/constants/time';
import { cn, pad } from '@/lib/utils';
import type { ContentMode } from '../world-filter/model/content-mode';
import { fetchMaintenance } from './model/fetch-maintenance';
import type { MaintenanceWithStatus } from './types/maintenance';

function isUpcoming(endIso: string | null, now: Temporal.Instant): boolean {
  if (endIso === null) return true;
  try {
    const end = Temporal.Instant.from(endIso);
    return Temporal.Instant.compare(end, now) > 0;
  } catch {
    return false;
  }
}

function getStatus(startIso: string | null, now: Temporal.Instant): '점검 진행중' | '점검 예정' {
  if (startIso == null) return '점검 예정';
  try {
    const start = Temporal.Instant.from(startIso);
    return Temporal.Instant.compare(start, now) <= 0 ? '점검 진행중' : '점검 예정';
  } catch {
    return '점검 예정';
  }
}

function formatZdt(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

function formatPeriodKst(startIso: string | null, endIso: string | null): string {
  if (startIso == null) return '기간 정보 없음';
  try {
    const start = Temporal.Instant.from(startIso).toZonedDateTimeISO('Asia/Seoul');
    const startStr = formatZdt(start);
    if (endIso === null) return `${startStr} ~ 미정`;
    const end = Temporal.Instant.from(endIso).toZonedDateTimeISO('Asia/Seoul');
    return `${startStr} ~ ${formatZdt(end)}`;
  } catch {
    return '기간 정보 없음';
  }
}

type Props = {
  contentMode: ContentMode;
};

export default async function Maintenance({ contentMode }: Props) {
  await connection();
  const maintenances = await fetchMaintenance(contentMode);

  if (maintenances === null) {
    return <p className={cn('w-full', 'mt-2', 'text-center', 'text-sm')}>점검 데이터를 불러오지 못했습니다. (500)</p>;
  }

  // 현재 시각은 서버에서 한 번만 구하기
  const now = Temporal.Now.instant();
  // '점검 진행중' | '점검 예정' 정보를 포함한 점검 정보 만들기
  const upcoming: MaintenanceWithStatus[] = maintenances
    .filter((m) => m.start_at != null && isUpcoming(m.end_at, now))
    .map((m) => ({
      ...m,
      status: getStatus(m.start_at, now),
      periodKst: formatPeriodKst(m.start_at, m.end_at),
    }));

  return (
    <section className={cn('max-w-[1252px]', 'mt-[26px] mx-auto', 'flex flex-col gap-[8px]')}>
      <h2 className="text-2xl font-bold text-main-white pl-4 xl:pl-0">점검 일정</h2>
      {upcoming.length === 0 ? (
        <p className="text-sub-white pl-4 xl:pl-0">진행 예정이거나 진행 중인 점검이 없습니다</p>
      ) : (
        <ul className={cn('flex flex-col gap-2', 'pl-4 xl:pl-0')}>
          {upcoming.map((m) => (
            <li key={m.id} className={cn('flex flex-col gap-1', 'text-sm')}>
              <a
                href={m.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline w-fit text-main-white">
                {m.name}
              </a>
              <span className="text-sub-white">
                <span className={cn(m.status === '점검 진행중' ? 'text-red-400' : 'text-yellow-400')}>{m.status}</span>
                {' : [KST] '}
                <span>{m.periodKst}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
