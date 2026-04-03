'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';

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

function SummaryMarkdown({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return <p className={cn('text-sm text-custom-lightgray')}>요약본 데이터가 없어요</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className={cn('mt-8 text-2xl font-bold first:mt-0')}>{children}</h1>,
        h2: ({ children }) => <h2 className={cn('mt-7 text-[22px] font-bold first:mt-0')}>{children}</h2>,
        h3: ({ children }) => <h3 className={cn('mt-6 text-[20px] font-semibold first:mt-0')}>{children}</h3>,
        h4: ({ children }) => <h4 className={cn('mt-6 text-[18px] font-semibold first:mt-0')}>{children}</h4>,
        p: ({ children }) => <p className={cn('leading-7 lg:text-base text-gray-300')}>{children}</p>,
        ul: ({ children }) => <ul className={cn('list-disc text-[16px] space-y-2 pl-5 text-gray-300')}>{children}</ul>,
        ol: ({ children }) => (
          <ol className={cn('list-decimal text-[16px] space-y-2 pl-5 text-gray-300')}>{children}</ol>
        ),
        li: ({ children }) => <li className={cn('leading-7 text-[16px] text-gray-300')}>{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-custom-green underline underline-offset-4')}>
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className={cn('border-l-4 border-custom-green/70 pl-4 text-gray-300')}>{children}</blockquote>
        ),
        pre: ({ children }) => (
          <pre className={cn('overflow-x-auto rounded-lg bg-black/30 p-4 text-sm')}>{children}</pre>
        ),
        code: ({ children, className }) =>
          className ? (
            <code className={className}>{children}</code>
          ) : (
            <code className={cn('rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]')}>{children}</code>
          ),
        table: ({ children }) => (
          <div className={cn('overflow-x-auto rounded-lg border border-white/10')}>
            <table className={cn('min-w-full border-collapse text-left text-sm lg:text-[16px]')}>{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className={cn('bg-white/5')}>{children}</thead>,
        tr: ({ children }) => <tr className={cn('border-b border-white/10 align-top')}>{children}</tr>,
        th: ({ children }) => <th className={cn('px-3 py-2 font-semibold text-white')}>{children}</th>,
        td: ({ children }) => <td className={cn('px-3 py-2 leading-7 text-gray-100')}>{children}</td>,
      }}>
      {value}
    </ReactMarkdown>
  );
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
      className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm', 'px-5')}
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
                className={cn('cursor-pointer shrink-0 rounded-md p-1 text-custom-lightgray hover:text-white')}>
                ✕
              </button>
              <h1 className={cn('break-keep text-xl font-bold text-white')}>{event.name}</h1>
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
                <dt className={cn('text-custom-lightgray')}>시작 시각</dt>
                <dd>{formatDate(event.startAtIso)}</dd>
              </div>
              <div className={cn('grid gap-1')}>
                <dt className={cn('text-custom-lightgray')}>종료 시각</dt>
                <dd>{formatDate(event.endAtIso)}</dd>
              </div>
            </dl>

            {event.gms_url ? (
              <a
                href={event.gms_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex w-fit rounded-md bg-custom-green px-3 py-2 text-sm font-semibold text-black',
                )}>
                원문 보기
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
