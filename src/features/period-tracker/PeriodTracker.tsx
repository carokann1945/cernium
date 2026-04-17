import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import type { ContentMode } from '../world-filter/model/content-mode';
import { toOngoingEventView } from './model/event-utils';
import { getCachedEvents } from './model/events';
import type { OngoingEventView } from './types/event';
import PeriodTrackerClient from './ui/PeriodTrackerClient';

type Props = {
  contentMode: ContentMode;
};

export default async function PeriodTracker({ contentMode }: Props) {
  await connection();

  const rawEvents = await getCachedEvents(contentMode);

  if (rawEvents === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>이벤트 데이터를 불러오지 못했습니다.</p>;
  }

  const now = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
  const events = rawEvents.map((e) => toOngoingEventView(e, now)).filter((e): e is OngoingEventView => e !== null);

  return <PeriodTrackerClient events={events} initialNowIso={now.toString()} />;
}
