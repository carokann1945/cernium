import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import type { GameVersion } from '../game-version/model/game-version';
import { toOngoingEventView } from './model/event-utils';
import { fetchEvent } from './model/fetch-event';
import type { OngoingEventView } from './types/event';
import EventClient from './ui/EventClient';

type Props = {
  gameVersion: GameVersion;
};

export default async function Event({ gameVersion }: Props) {
  await connection();

  const rawEvents = await fetchEvent(gameVersion);

  if (rawEvents === null) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>이벤트 데이터를 불러오지 못했습니다.</p>;
  }

  const now = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
  const events = rawEvents.map((e) => toOngoingEventView(e, now)).filter((e): e is OngoingEventView => e !== null);

  return <EventClient events={events} initialNowIso={now.toString()} />;
}
