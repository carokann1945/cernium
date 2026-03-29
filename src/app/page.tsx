import type { Metadata } from 'next';
import { Suspense } from 'react';
import MaintenanceTracker from '@/features/maintenance-tracker/MaintenanceTracker';
import PeriodTracker from '@/features/period-tracker/PeriodTracker';

export const metadata: Metadata = {
  title: 'Cernium | 점검 일정 & 진행중 이벤트',
  description:
    'GMS 이벤트와 점검 공지를 자동으로 정리해 제공합니다. 진행 중 이벤트, 점검 일정, KMS 이벤트 매칭까지 한눈에 확인하세요.',
  keywords: ['메이플 이벤트', '메이플 점검', '메이플 일정', '메이플 이벤트 정리'],
  openGraph: {
    title: 'Cernium | 점검 일정 & 진행중 이벤트',
    description: '진행중 이벤트, 점검 일정(KST), KMS 이벤트 매칭까지 한눈에 확인',
    url: 'https://cernium.vercel.app/',
    siteName: 'Cernium',
    images: [
      {
        url: 'https://cernium.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
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
