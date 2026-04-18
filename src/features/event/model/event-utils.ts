import { Temporal } from '@js-temporal/polyfill';
import { DAY_ABBRS } from '@/constants/time';
import { toCloudinaryFetchUrl } from '@/lib/cloudinary/fetch';
import { pad } from '@/lib/utils';
import type { Event, OngoingEventView, SortOrder } from '../types/event';

function formatKST(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

export function toOngoingEventView(event: Event, now: Temporal.ZonedDateTime): OngoingEventView | null {
  if (!event.start_at || !event.end_at) return null;

  let start: Temporal.ZonedDateTime;
  let end: Temporal.ZonedDateTime;

  try {
    start = Temporal.Instant.from(event.start_at).toZonedDateTimeISO('Asia/Seoul');
    end = Temporal.Instant.from(event.end_at).toZonedDateTimeISO('Asia/Seoul');
  } catch {
    return null;
  }

  if (Temporal.ZonedDateTime.compare(now, start) < 0) return null;
  if (Temporal.ZonedDateTime.compare(now, end) >= 0) return null;

  const periodKst = `${formatKST(start)} ~ ${formatKST(end)}`;

  return {
    id: event.id,
    name: event.name,
    live_date: event.live_date,
    image_thumbnail: toCloudinaryFetchUrl(event.image_thumbnail),
    gms_url: event.gms_url,
    summary: event.summary,
    periodKst,
    startAtIso: start.toInstant().toString(),
    endAtIso: end.toInstant().toString(),
  };
}

export function sortOngoingEventsByLatest(events: OngoingEventView[]): OngoingEventView[] {
  return events.slice().sort((a, b) => (b.live_date ?? '').localeCompare(a.live_date ?? ''));
}

export function sortOngoingEventsByDeadline(events: OngoingEventView[]): OngoingEventView[] {
  return events
    .slice()
    .sort((a, b) => Temporal.Instant.compare(Temporal.Instant.from(a.endAtIso), Temporal.Instant.from(b.endAtIso)));
}

export function sortOngoingEvents(events: OngoingEventView[], order: SortOrder): OngoingEventView[] {
  return order === 'deadline' ? sortOngoingEventsByDeadline(events) : sortOngoingEventsByLatest(events);
}
