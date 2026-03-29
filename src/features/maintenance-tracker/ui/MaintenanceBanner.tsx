'use client';

import { Temporal } from '@js-temporal/polyfill';
import { cn } from '@/lib/utils';
import { useMaintenanceStore } from '../model/MaintenanceStore';
import type { Maintenance } from '../types/maintenance';

const KST = 'Asia/Seoul';
const DAY_ABBRS = ['월', '화', '수', '목', '금', '토', '일'] as const;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatZdt(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

function formatPeriod(m: Maintenance): string {
  try {
    const startKst = Temporal.Instant.from(m.start_at).toZonedDateTimeISO(KST);
    const endKst = Temporal.Instant.from(m.end_at).toZonedDateTimeISO(KST);
    return `${formatZdt(startKst)} ~ ${formatZdt(endKst)}`;
  } catch {
    return '기간 정보 없음';
  }
}

function getStatus(startIso: string, now: Temporal.Instant): '점검 진행중' | '점검 예정' {
  try {
    const start = Temporal.Instant.from(startIso);
    return Temporal.Instant.compare(start, now) <= 0 ? '점검 진행중' : '점검 예정';
  } catch {
    return '점검 예정';
  }
}

export default function MaintenanceBanner() {
  const upcoming = useMaintenanceStore((state) => state.upcoming);
  const isInitialized = useMaintenanceStore((state) => state.isInitialized);

  if (!isInitialized || upcoming.length === 0)
    return (
      <section className={cn('max-w-[1252px]', 'mt-[40px] mx-auto', 'flex flex-col gap-[8px]')}>
        <h2 className="text-2xl font-bold pl-4 xl:pl-0">점검 일정</h2>
        <p className="text-[16px] pl-4 xl:pl-0">진행 예정이거나 진행 중인 점검이 없습니다</p>
      </section>
    );

  const now = Temporal.Now.instant();

  return (
    <section className={cn('max-w-[1252px]', 'mt-[40px] mx-auto', 'flex flex-col gap-[8px]')}>
      <h2 className="text-2xl font-bold pl-4 xl:pl-0">점검 일정</h2>
      <ul className={cn('flex flex-col gap-1 pl-4 xl:pl-0')}>
        {upcoming.map((m) => {
          const status = getStatus(m.start_at, now);
          return (
            <li key={m.id} className={cn('flex items-center gap-2', 'text-sm')}>
              <a href={m.url} target="_blank" rel="noopener noreferrer" className={cn('hover:underline')}>
                {m.name}
              </a>
              <span className={cn('text-gray-400')}>
                <span className={cn(status === '점검 진행중' ? 'text-red-400' : 'text-yellow-400')}>{status}</span>
                {' : '}
                {formatPeriod(m)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
