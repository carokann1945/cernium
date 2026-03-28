import { Suspense } from 'react';
import Footer from '@/components/layout/Footer';
import PeriodTracker from '@/features/period-tracker/PeriodTracker';

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>로딩 중...</div>}>
        <PeriodTracker />
      </Suspense>
      <Footer />
    </>
  );
}
