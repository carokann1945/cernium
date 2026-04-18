import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import type { ContentMode } from '../world-filter/model/content-mode';
import { fetchNews } from './model/fetch-news';
import { toNewsView } from './model/news-utils';
import NewsClient from './ui/NewsClient';

const KST = 'Asia/Seoul';

type Props = {
  contentMode: ContentMode;
};

export default async function NewsServer({ contentMode }: Props) {
  await connection();

  const rawNews = await fetchNews(contentMode);

  if (rawNews === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>뉴스 데이터를 불러오지 못했습니다.</p>;
  }

  const latestCreatedAt = [...rawNews]
    .map((n) => n.created_at)
    .sort()
    .at(-1);

  const lastUpdated = latestCreatedAt
    ? (() => {
        const zdt = Temporal.Instant.from(latestCreatedAt).toZonedDateTimeISO(KST);
        return `${zdt.year}.${String(zdt.month).padStart(2, '0')}.${String(zdt.day).padStart(2, '0')}`;
      })()
    : '';

  const news = [...rawNews]
    .sort((a, b) => (b.live_date ?? '').localeCompare(a.live_date ?? ''))
    .slice(0, 8)
    .map((n) => toNewsView(n));

  return <NewsClient news={news} lastUpdated={lastUpdated} />;
}
