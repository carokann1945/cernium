'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { NewsView } from '../types/news';

const SummaryMarkdown = dynamic(() => import('@/features/period-tracker/ui/SummaryMarkdown'), { ssr: false });

type Props = {
  news: NewsView;
  onClose: () => void;
};

export default function NewsModal({ news, onClose }: Props) {
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
              <h1 className={cn('font-glegoo font-[700] break-keep text-xl')}>{news.name}</h1>
            </div>

            {news.image_thumbnail ? (
              <figure className={cn('relative aspect-[540/304] overflow-hidden rounded-lg')}>
                <Image
                  src={news.image_thumbnail}
                  alt={news.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 304px"
                  className={cn('object-cover')}
                  unoptimized
                />
              </figure>
            ) : null}

            {news.url ? (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex w-fit rounded-md bg-custom-lightgray border border-gray-500 px-3 py-2 text-sm text-main-white',
                  'hover:bg-custom-lightergray transition-all duration-100',
                )}>
                원문 보기
              </a>
            ) : null}
          </div>

          <div className={cn('min-w-0 space-y-3')}>
            <div className={cn('space-y-4 text-sm')}>
              <SummaryMarkdown value={news.translation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
