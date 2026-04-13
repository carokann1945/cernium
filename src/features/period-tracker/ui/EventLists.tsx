'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';

const importSummaryModal = () => import('./SummaryModal');
const importSummaryMarkdown = () => import('./SummaryMarkdown');

const prefetchSummaryModal = () => {
  void importSummaryModal();
  void importSummaryMarkdown();
};

const SummaryModal = dynamic(importSummaryModal, { ssr: false });

type Props = {
  events: OngoingEventView[];
};

export default function EventLists({ events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<OngoingEventView | null>(null);

  if (events.length === 0) {
    return (
      <section className={cn('max-w-[1252px]', 'flex gap-[8px] items-center', 'mx-auto my-[50px]')}>
        <figure className={cn('relative w-[50px] h-[50px]')}>
          <Image src="/images/dawn.png" alt="" fill sizes="50px" className="object-cover" />
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
                    sizes="284px"
                    unoptimized
                  />
                )}
              </figure>
              <span className={cn('font-glegoo text-[17px] text-main-white font-[700] line-clamp-2 min-h-[86px]')}>
                {event.name}
              </span>
            </a>
            <div className={cn('flex flex-col gap-[8px]')}>
              <p className={cn('text-sub-white break-keep')}>{event.periodKst}</p>
              {event.summary && (
                <button
                  type="button"
                  onMouseEnter={prefetchSummaryModal}
                  onFocus={prefetchSummaryModal}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    'cursor-pointer px-[10px] py-[2px] bg-custom-lightgray rounded-sm border border-gray-500',
                    'self-start text-main-white text-[14px]',
                    'hover:bg-custom-lightergray transition-all duration-100',
                  )}>
                  한글 번역
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedEvent && <SummaryModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </section>
  );
}
