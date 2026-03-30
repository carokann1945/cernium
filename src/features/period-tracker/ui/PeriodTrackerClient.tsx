'use client';

import { useState } from 'react';
import { sortOngoingEvents } from '../model/event-utils';
import type { OngoingEventView, SortOrder } from '../types/event';
import EventLists from './EventLists';
import EventPeriodChart from './EventPeriodChart';
import { SortOrderToggle } from './SortOrderToggle';

type Props = {
  events: OngoingEventView[];
  initialNowIso: string;
};

export default function PeriodTrackerClient({ events, initialNowIso }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const sorted = sortOngoingEvents(events, sortOrder);

  return (
    <>
      <section className="max-w-[1250px] flex flex-col gap-[8px] bg-[#121316] text-white select-none mt-[40px] mx-auto">
        <div className="flex items-center gap-[16px]">
          <h2 className="text-2xl font-bold pl-4 xl:pl-0">진행 중 이벤트</h2>
          <SortOrderToggle value={sortOrder} onChange={setSortOrder} />
        </div>
        <EventPeriodChart events={sorted} initialNowIso={initialNowIso} />
      </section>
      <EventLists events={sorted} />
    </>
  );
}
