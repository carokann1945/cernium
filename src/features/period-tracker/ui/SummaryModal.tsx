'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';

const SummaryMarkdown = dynamic(() => import('./SummaryMarkdown'), { ssr: false });

type Props = {
  event: OngoingEventView;
  onClose: () => void;
};

function formatDate(value: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(date);
}

export default function SummaryModal({ event, onClose }: Props) {
  useEffect(() => {
    history.pushState({ modal: true }, '');
    document.body.style.overflow = 'hidden';

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm', 'px-5')}
      onClick={() => history.back()}>
      <div
        className={cn(
          'relative w-full max-w-[1200px] max-h-[85vh] overflow-y-auto scrollbar-custom',
          'rounded-xl bg-custom-nav-bg p-6',
        )}
        onClick={(e) => e.stopPropagation()}>
        <div className={cn('grid gap-6 lg:grid-cols-[304px_minmax(0,1fr)]')}>
          <div className={cn('space-y-4')}>
            <div className={cn('space-y-2')}>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => history.back()}
                className={cn('cursor-pointer shrink-0 rounded-md p-1 text-sub-white hover:text-main-white')}>
                ✕
              </button>
              <h1 className={cn('font-glegoo font-[700] break-keep text-xl')}>{event.name}</h1>
            </div>

            {event.image_thumbnail ? (
              <figure className={cn('relative aspect-[540/304] overflow-hidden rounded-lg')}>
                <Image
                  src={event.image_thumbnail}
                  alt={event.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 304px"
                  className={cn('object-cover')}
                />
              </figure>
            ) : null}

            <dl className={cn('grid gap-3 text-sm')}>
              <div className={cn('grid gap-1')}>
                <dt className={cn('text-sub-white')}>시작 시각</dt>
                <dd>{formatDate(event.startAtIso)}</dd>
              </div>
              <div className={cn('grid gap-1')}>
                <dt className={cn('text-sub-white')}>종료 시각</dt>
                <dd>{formatDate(event.endAtIso)}</dd>
              </div>
            </dl>

            {event.gms_url ? (
              <a
                href={event.gms_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex w-fit rounded-md bg-custom-lightgray border border-gray-500 px-3 py-2 text-sm text-main-white',
                  'hover:bg-custom-lightergray transition-all duration-100',
                )}>
                GMS 공지 보기
              </a>
            ) : null}
          </div>

          <div className={cn('min-w-0 space-y-3')}>
            <div className={cn('space-y-4 text-sm')}>
              <SummaryMarkdown value={event.summary} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
