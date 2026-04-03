'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';
import SummaryModal from './SummaryModal';

type Props = {
  events: OngoingEventView[];
};

export default function EventLists({ events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<OngoingEventView | null>(null);

  if (events.length === 0) {
    return (
      <section className={cn('max-w-[1252px]', 'flex gap-[8px] items-center', 'mx-auto my-[50px]')}>
        <figure className={cn('relative w-[50px] h-[50px]')}>
          <Image src="/images/dawn.png" alt="데이터 없음 이미지" fill sizes="50" className="object-cover" />
        </figure>
        <h2 className={cn('text-xl font-bold')}>진행 중 이벤트가 없어요.</h2>
      </section>
    );
  }

  return (
    <section className={cn('max-w-[1252px]', 'flex flex-col gap-[16px]', 'mx-auto my-[50px]')}>
      <ul className={cn('w-full', 'grid gap-3 grid-cols-[repeat(auto-fit,304px)] justify-center')}>
        {events.map((event) => (
          <li
            key={event.id}
            className={cn(
              'w-[300px] min-h-[310px]',
              'flex flex-col justify-between',
              'bg-custom-nav-bg p-2 rounded-md',
              'hover:scale-105 transition-all duration-200',
            )}>
            <a
              className={cn('cursor-pointer w-full', 'flex flex-col gap-[8px]')}
              href={event.gms_url ?? '#'}
              rel="noopener noreferrer"
              target="_blank">
              <figure className={cn('w-full h-[160px] relative')}>
                {event.image_thumbnail && (
                  <Image
                    className={cn('rounded-md object-cover')}
                    src={event.image_thumbnail}
                    alt={event.name}
                    fill
                    sizes="100"
                    loading="eager"
                  />
                )}
              </figure>
              <span className={cn('font-bold line-clamp-2 min-h-[56px]')}>{event.name}</span>
            </a>
            <div className={cn('flex flex-col gap-[8px]')}>
              <p className={cn('text-sm text-gray-300 break-keep')}>[KST] {event.periodKst}</p>
              {event.summary && (
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    'cursor-pointer px-[10px] py-px bg-custom-lightgray rounded-md',
                    'self-start text-white font-semibold text-[14px]',
                    'hover:bg-gray-400 transition-all duration-200',
                  )}>
                  요약 보기
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <SummaryModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
