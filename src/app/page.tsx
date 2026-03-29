import { Suspense } from 'react';
import MaintenanceTracker from '@/features/maintenance-tracker/MaintenanceTracker';
import PeriodTracker from '@/features/period-tracker/PeriodTracker';

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
