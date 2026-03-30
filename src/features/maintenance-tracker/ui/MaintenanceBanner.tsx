'use client';

import { cn } from '@/lib/utils';
import type { MaintenanceWithStatus } from '../types/maintenance';

export default function MaintenanceBanner({ upcoming }: { upcoming: MaintenanceWithStatus[] }) {
  if (upcoming.length === 0)
    return (
      <section className={cn('max-w-[1252px]', 'mt-[40px] mx-auto', 'flex flex-col gap-[8px]')}>
        <h2 className="text-2xl font-bold pl-4 xl:pl-0">점검 일정</h2>
        <p className="text-[16px] pl-4 xl:pl-0">진행 예정이거나 진행 중인 점검이 없습니다</p>
      </section>
    );

  return (
    <section className={cn('max-w-[1252px]', 'mt-[40px] mx-auto', 'flex flex-col gap-[8px]')}>
      <h2 className="text-2xl font-bold pl-4 xl:pl-0">점검 일정</h2>
      <ul className={cn('flex flex-col gap-1 pl-4 xl:pl-0')}>
        {upcoming.map((m) => {
          return (
            <li key={m.id} className={cn('flex items-center gap-2', 'text-sm')}>
              <a href={m.url} target="_blank" rel="noopener noreferrer" className={cn('hover:underline')}>
                {m.name}
              </a>
              <span className={cn('text-gray-400')}>
                <span className={cn(m.status === '점검 진행중' ? 'text-red-400' : 'text-yellow-400')}>{m.status}</span>
                {' : [KST] '}
                {/* {formatPeriod(m)} */}
                <time dateTime={m.start_at}>{m.periodKst}</time>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
