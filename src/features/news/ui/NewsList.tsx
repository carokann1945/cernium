'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { NewsView } from '../types/news';

const importNewsModal = () => import('./NewsModal');

const prefetchNewsModal = () => {
  void importNewsModal();
};

const NewsModal = dynamic(importNewsModal, { ssr: false });

type Props = {
  news: NewsView[];
};

export default function NewsList({ news }: Props) {
  const [selectedNews, setSelectedNews] = useState<NewsView | null>(null);

  if (news.length === 0) {
    return (
      <section className={cn('max-w-[1252px]', 'flex gap-[8px] items-center', 'mx-auto my-[16px]')}>
        <figure className={cn('relative w-[50px] h-[65px]')}>
          <Image src="/images/dawn.png" alt="" fill sizes="50px" className="object-cover" />
        </figure>
        <h2 className={cn('text-lg font-bold text-sub-white')}>뉴스가 없어요.</h2>
      </section>
    );
  }

  return (
    <section className={cn('max-w-[1252px]', 'flex flex-col gap-[16px]', 'mx-auto my-[16px]')}>
      <ul
        className={cn(
          'w-full pl-4 xl:pl-0',
          'grid gap-3 grid-cols-[repeat(auto-fit,304px)] justify-center sm:justify-start',
        )}>
        {news.map((item) => (
          <li
            key={item.id}
            className={cn(
              'w-[300px] min-h-[310px]',
              'flex flex-col justify-between',
              'bg-custom-nav-bg p-2 rounded-md',
              'hover:scale-105 transition-all duration-200',
            )}>
            <a
              className={cn('cursor-pointer w-full', 'flex flex-col gap-[8px]')}
              href={item.url ?? '#'}
              rel="noopener noreferrer"
              target="_blank">
              <figure className={cn('w-full h-[160px] relative')}>
                {item.isNew && (
                  <span
                    className={cn(
                      'absolute top-2 left-2 z-10',
                      'px-[8px] py-[2px]',
                      'bg-red-500 text-main-white text-[12px] font-bold rounded-sm',
                    )}>
                    NEW
                  </span>
                )}
                {item.image_thumbnail && (
                  <Image
                    className={cn('rounded-md object-cover')}
                    src={item.image_thumbnail}
                    alt={item.name}
                    fill
                    sizes="284px"
                    unoptimized
                  />
                )}
              </figure>
              <span className={cn('font-glegoo text-[17px] text-main-white font-[700] line-clamp-3 min-h-[86px]')}>
                {item.name}
              </span>
            </a>
            <div className={cn('flex flex-col gap-[8px]')}>
              <p className={cn('text-sub-white break-keep')}>{item.liveDateKst}</p>
              {item.translation && (
                <button
                  type="button"
                  onMouseEnter={prefetchNewsModal}
                  onFocus={prefetchNewsModal}
                  onClick={() => setSelectedNews(item)}
                  className={cn(
                    'cursor-pointer px-[10px] py-[2px] bg-custom-lightgray rounded-sm border border-gray-500',
                    'self-start text-main-white text-[14px]',
                    'hover:bg-custom-lightergray transition-all duration-100',
                  )}>
                  한글 요약
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedNews && <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </section>
  );
}
