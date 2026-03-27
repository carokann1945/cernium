import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { getCachedEvents } from '../model/events';
import EventListsClient from './EventListsClient';

export default async function EventLists() {
  const events = await getCachedEvents();

  if (events === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>이벤트 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <Suspense fallback={<p className="w-full mt-10 text-center">이벤트를 불러오는 중...</p>}>
      <EventListsClient events={events} />
    </Suspense>
  );
}
