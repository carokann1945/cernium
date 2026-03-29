'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEventStore } from '../model/EventStore';
import { formatEventPeriodToKST } from '../model/event-utils';

export default function EventListsClient() {
  const ongoingEvents = useEventStore((store) => store.ongoingEvents);
  const isInitialized = useEventStore((store) => store.isInitialized);

  if (!isInitialized) {
    return (
      <section className={cn('max-w-[1252px]', 'flex gap-[8px] items-center', 'mx-auto my-[50px]')}>
        <figure className={cn('relative w-[50px] h-[50px]')}>
          <Image src="/images/fire.png" alt="로딩중 이미지" fill sizes="50" className="object-cover" />
        </figure>
        <h2 className={cn('text-xl font-bold')}>로딩중...</h2>
      </section>
    );
  }

  if (ongoingEvents.length === 0) {
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
        {ongoingEvents.map((event) => (
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
                    loading="eager"
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
                  className={cn('cursor-pointer px-[10px] py-px bg-custom-green rounded-md', 'self-start')}>
                  kms
                </a>
              ) : (
                <button className={cn('px-[10px] py-px bg-red-400 rounded-md', 'self-start')}>gms only</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
