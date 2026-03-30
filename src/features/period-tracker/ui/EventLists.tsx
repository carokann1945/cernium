'use client';

import Image from 'next/image';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';

type Props = {
  events: OngoingEventView[];
};

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;

  const userAgentData = (
    navigator as Navigator & {
      userAgentData?: { mobile?: boolean };
    }
  ).userAgentData;

  if (typeof userAgentData?.mobile === 'boolean') {
    return userAgentData.mobile;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function getMobileKmsUrl(url: string) {
  try {
    const nextUrl = new URL(url);

    if (nextUrl.hostname === 'maplestory.nexon.com') {
      nextUrl.hostname = 'm.maplestory.nexon.com';
    }

    return nextUrl.toString();
  } catch {
    return url;
  }
}

export default function EventLists({ events }: Props) {
  const handleKmsClick = (e: MouseEvent<HTMLAnchorElement>, kmsUrl: string) => {
    if (!isMobileDevice()) return;

    e.preventDefault();
    window.open(getMobileKmsUrl(kmsUrl), '_blank', 'noopener,noreferrer');
  };

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
              <p className={cn('text-sm text-gray-300 break-keep')}>[KST] {event.periodKst}</p>
              {event.kms_url ? (
                <a
                  href={event.kms_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleKmsClick(e, event.kms_url!)}
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
