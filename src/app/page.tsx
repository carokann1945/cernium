import type { Metadata } from 'next';
import { Suspense } from 'react';
import Event from '@/features/event/Event';
import { EventSkeleton } from '@/features/event/EventSkeleton';
import Maintenance from '@/features/maintenance/Maintenance';
import { MaintenanceSkeleton } from '@/features/maintenance/MaintenanceSkeleton';
import News from '@/features/news/News';
import { NewsSkeleton } from '@/features/news/NewsSkeleton';
import { getContentModeFromCookies } from '@/features/world-filter/model/content-mode-cookie';
import ContentModeSelect from '@/features/world-filter/ui/ContentModeSelect';

export const metadata: Metadata = {
  keywords: ['메이플 이벤트', '메이플 점검', '메이플 일정', '메이플 이벤트 정리'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Cernium | 점검 일정 & 진행중 이벤트',
    description: '진행중 이벤트, 점검 일정(KST), 한글 번역, 요약본까지 한눈에 확인',
    url: '/',
    siteName: 'Cernium',
    images: [{ url: '/images/cernium-ogimage.png', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cernium | 점검 일정 & 진행중 이벤트',
    description: '진행중 이벤트, 점검 일정(KST), 한글 번역, 요약본까지 한눈에 확인',
    images: ['/images/cernium-ogimage.png'],
  },
};

export default async function Home() {
  const contentMode = await getContentModeFromCookies();

  return (
    <>
      <ContentModeSelect value={contentMode} />
      <Suspense fallback={<MaintenanceSkeleton />}>
        <Maintenance contentMode={contentMode} />
      </Suspense>
      <Suspense fallback={<EventSkeleton />}>
        <Event contentMode={contentMode} />
      </Suspense>
      <Suspense fallback={<NewsSkeleton />}>
        <News contentMode={contentMode} />
      </Suspense>
    </>
  );
}
