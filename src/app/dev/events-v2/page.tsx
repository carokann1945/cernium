import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type EventV2 = {
  id: string;
  name: string;
  live_date: string | null;
  start_at: string | null;
  end_at: string | null;
  gms_url: string | null;
  image_thumbnail: string | null;
  summary: string | null;
};

export const metadata: Metadata = {
  title: 'events_v2 미리보기',
  robots: { index: false, follow: false },
};

async function getEventsV2(): Promise<EventV2[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('events_v2').select('*').order('live_date', { ascending: false });

  if (error) {
    console.error('[events_v2] Supabase query failed:', error.message);
    return null;
  }

  return (data as EventV2[]) ?? null;
}

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
    return <p className={cn('text-sm text-custom-lightgray')}>summary가 없습니다.</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className={cn('mt-8 text-[30px] font-bold first:mt-0')}>{children}</h1>,
        h2: ({ children }) => <h2 className={cn('mt-7 text-xl font-bold first:mt-0')}>{children}</h2>,
        h3: ({ children }) => <h3 className={cn('mt-6 text-lg font-semibold first:mt-0')}>{children}</h3>,
        p: ({ children }) => <p className={cn('leading-7 text-gray-100')}>{children}</p>,
        ul: ({ children }) => <ul className={cn('list-disc space-y-2 pl-5')}>{children}</ul>,
        ol: ({ children }) => <ol className={cn('list-decimal space-y-2 pl-5')}>{children}</ol>,
        li: ({ children }) => <li className={cn('leading-7 text-gray-100')}>{children}</li>,
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
            <table className={cn('min-w-full border-collapse text-left text-sm')}>{children}</table>
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

export default async function EventsV2DevPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  await connection();

  const events = await getEventsV2();

  if (events === null) {
    return (
      <section className={cn('mx-auto max-w-[1200px] px-4 py-10')}>
        <p>events_v2를 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className={cn('mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10')}>
      <header className={cn('space-y-2')}>
        <h1 className={cn('text-3xl font-bold')}>events_v2 summary 미리보기</h1>
        <p className={cn('text-sm text-custom-lightgray')}>총 {events.length}개</p>
      </header>

      <ul className={cn('flex flex-col gap-6')}>
        {events.map((event) => (
          <li key={event.id} className={cn('rounded-xl border border-white/10 bg-custom-nav-bg p-5')}>
            <div className={cn('grid gap-6 lg:grid-cols-[304px_minmax(0,1fr)]')}>
              <div className={cn('space-y-4')}>
                <div className={cn('space-y-2')}>
                  <p className={cn('text-xs text-custom-lightgray')}>ID {event.id}</p>
                  <h2 className={cn('break-keep text-xl font-bold')}>{event.name}</h2>
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
                    <dt className={cn('text-custom-lightgray')}>게시 시각</dt>
                    <dd>{formatDate(event.live_date)}</dd>
                  </div>
                  <div className={cn('grid gap-1')}>
                    <dt className={cn('text-custom-lightgray')}>시작 시각</dt>
                    <dd>{formatDate(event.start_at)}</dd>
                  </div>
                  <div className={cn('grid gap-1')}>
                    <dt className={cn('text-custom-lightgray')}>종료 시각</dt>
                    <dd>{formatDate(event.end_at)}</dd>
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
                <h3 className={cn('text-lg font-semibold')}>summary</h3>
                <div className={cn('space-y-4 text-sm')}>
                  <SummaryMarkdown value={event.summary} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
