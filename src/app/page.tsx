import type { Metadata } from 'next';
import { Suspense } from 'react';
import MaintenanceTracker from '@/features/maintenance-tracker/MaintenanceTracker';
import PeriodTracker from '@/features/period-tracker/PeriodTracker';

export const metadata: Metadata = {
  keywords: ['메이플 이벤트', '메이플 점검', '메이플 일정', '메이플 이벤트 정리'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Cernium | 점검 일정 & 진행중 이벤트',
    description: '진행중 이벤트, 점검 일정(KST), KMS 이벤트 매칭까지 한눈에 확인',
    url: '/',
    siteName: 'Cernium',
    images: [{ url: '/images/ogimage.png', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cernium | 점검 일정 & 진행중 이벤트',
    description: '진행중 이벤트, 점검 일정(KST), KMS 이벤트 매칭까지 한눈에 확인',
    images: ['/images/ogimage.png'],
  },
};

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>로딩 중...</div>}>
        <MaintenanceTracker />
        <PeriodTracker />
      </Suspense>
    </>
  );
}
