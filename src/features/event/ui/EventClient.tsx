'use client';

import { useState } from 'react';
import { sortOngoingEvents } from '../model/event-utils';
import type { OngoingEventView, SortOrder } from '../types/event';
import EventChart from './EventChart';
import EventList from './EventList';
import { EventSortOrderToggle } from './EventSortOrderToggle';

type Props = {
  events: OngoingEventView[];
  initialNowIso: string;
};

export default function EventClient({ events, initialNowIso }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const sorted = sortOngoingEvents(events, sortOrder);

  return (
    <>
      <section className="max-w-[1252px] flex flex-col gap-[8px] bg-custom-bg select-none mt-[70px] mx-auto">
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-[16px]">
          <h2 className="text-2xl text-main-white font-bold pl-4 xl:pl-0">진행 중 이벤트</h2>
          <EventSortOrderToggle value={sortOrder} onChange={setSortOrder} />
        </div>
        <EventChart events={sorted} initialNowIso={initialNowIso} />
      </section>
      <EventList events={sorted} />
    </>
  );
}
