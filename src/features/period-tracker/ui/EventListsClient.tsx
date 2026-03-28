'use client';

import { Temporal } from '@js-temporal/polyfill';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatEventPeriodToKST, isOngoingEvent } from '../model/event-period';
import type { Event } from '../types/event';

type Props = {
  events: Event[];
};

type EventWithPeriod = Event & {
  event_period: string;
};

export default function EventListsClient({ events }: Props) {
  const [now] = useState(() => Temporal.Now.zonedDateTimeISO('UTC'));

  const ongoingEvents = events.filter(
    (event): event is EventWithPeriod => !!event.event_period && isOngoingEvent(event.event_period, now),
  );

  if (ongoingEvents.length === 0) {
    return null;
  }

  return (
    <div className={cn('max-w-[1252px]', 'flex flex-col gap-[16px]', 'mx-auto my-[50px]')}>
      <ul className={cn('w-full', 'grid gap-3 grid-cols-[repeat(auto-fit,304px)] justify-center')}>
        {ongoingEvents.map((event: Event) => (
          <li
            key={event.id}
            className={cn(
              'w-[300px] min-h-[300px]',
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
                {event.image_url && (
                  <Image
                    className={cn('rounded-md object-cover')}
                    src={`https://g.nexonstatic.com${event.image_url}`}
                    alt={event.name}
                    fill
                    sizes="100"
                  />
                )}
              </figure>
              <span className={cn('font-bold line-clamp-2 min-h-[56px]')}>{event.name}</span>
            </a>
            <div className={cn('flex flex-col gap-[6px]')}>
              <p className={cn('text-sm text-gray-300 break-keep')}>
                {event.event_period ? `[KST] ${formatEventPeriodToKST(event.event_period)}` : '기간 정보 없음'}
              </p>
              {event.kms_url ? (
                <a
                  href={event.kms_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('cursor-pointer px-[10px] py-px bg-custom-green rounded-md', 'self-start')}
                  type="button">
                  kms
                </a>
              ) : (
                <button className={cn('px-[10px] py-px bg-red-400 rounded-md', 'self-start')}>gms only</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
