import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import { getCachedNews } from './model/news';
import { toNewsView } from './model/news-utils';
import NewsTrackerClient from './ui/NewsTrackerClient';

export default async function NewsTracker() {
  await connection();

  const rawNews = await getCachedNews();

  if (rawNews === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>뉴스 데이터를 불러오지 못했습니다.</p>;
  }

  const lastUpdated =
    [...rawNews]
      .map((n) => n.created_at)
      .sort()
      .at(-1)
      ?.slice(0, 10)
      .replace(/-/g, '.') ?? '';

  const news = [...rawNews]
    .sort((a, b) => (b.live_date ?? '').localeCompare(a.live_date ?? ''))
    .slice(0, 8)
    .map((n) => toNewsView(n));

  return <NewsTrackerClient news={news} lastUpdated={lastUpdated} />;
}
