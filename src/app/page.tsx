import type { Metadata } from 'next';
import { Suspense } from 'react';
import MaintenanceTracker from '@/features/maintenance-tracker/MaintenanceTracker';
import { MaintenanceTrackerSkeleton } from '@/features/maintenance-tracker/MaintenanceTrackerSkeleton';
import PeriodTracker from '@/features/period-tracker/PeriodTracker';
import { PeriodTrackerSkeleton } from '@/features/period-tracker/PeriodTrackerSkeleton';

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

export default function Home() {
  return (
    <>
      <Suspense fallback={<MaintenanceTrackerSkeleton />}>
        <MaintenanceTracker />
      </Suspense>
      <Suspense fallback={<PeriodTrackerSkeleton />}>
        <PeriodTracker />
      </Suspense>
    </>
  );
}
