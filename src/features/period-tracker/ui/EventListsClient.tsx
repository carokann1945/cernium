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
    return <p className={cn('w-full', 'mt-10', 'text-center')}>진행 중인 이벤트가 없습니다.</p>;
  }

  return (
    <div className={cn('max-w-[1252px]', 'flex flex-col gap-[16px]', 'mx-auto my-[80px]')}>
      <h2 className={cn('w-full text-2xl font-bold pl-4 xl:pl-0')}>진행중 이벤트</h2>
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
              className={cn('curosr-pointer w-full', 'flex flex-col gap-[8px]')}
              href={event.gms_url ?? '#'}
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
              <span className={cn('font-bold')}>{event.name}</span>
            </a>
            <p className={cn('text-sm text-gray-300 break-keep')}>
              {event.event_period ? `${formatEventPeriodToKST(event.event_period)} (KST)` : '기간 정보 없음'}
            </p>
            {event.kms_url ? (
              <a
                href={event.kms_url}
                target="_blank"
                className={cn('cursor-pointer px-[10px] py-px bg-custom-green rounded-md', 'self-start')}
                type="button">
                kms
              </a>
            ) : (
              <button className={cn('px-[10px] py-px bg-red-400 rounded-md', 'self-start')}>gms only</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
