import { cn } from '@/lib/utils';
import EventStoreInitializer from './EventStoreInitializer';
import { getCachedEvents } from './model/events';
import EventLists from './ui/EventLists';
import EventPeriodChart from './ui/EventPeriodChart';

export default async function PeriodTracker() {
  const events = await getCachedEvents();

  if (events === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>이벤트 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <>
      <EventStoreInitializer initialEvents={events} />
      <EventPeriodChart />
      <EventLists />
    </>
  );
}
