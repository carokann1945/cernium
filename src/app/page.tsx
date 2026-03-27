import { Suspense } from 'react';
import EventLists from '@/features/period-tracker/ui/EventLists';
import EventPeriodChart from '@/features/period-tracker/ui/EventPeriodChart';

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>차트 불러오는 중...</div>}>
        <EventPeriodChart />
      </Suspense>
      <EventLists />
    </>
  );
}
