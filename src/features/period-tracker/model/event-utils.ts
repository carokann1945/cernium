import { Temporal } from '@js-temporal/polyfill';
import { toCloudinaryFetchUrl } from '@/lib/cloudinary/fetch';
import { DAY_ABBRS } from '../../../constants/time';
import type { Event, OngoingEventView, SortOrder } from '../types/event';

const KST = 'Asia/Seoul';

function formatKST(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toOngoingEventView(event: Event, now: Temporal.ZonedDateTime): OngoingEventView | null {
  if (!event.start_at || !event.end_at) return null;

  let start: Temporal.ZonedDateTime;
  let end: Temporal.ZonedDateTime;

  try {
    start = Temporal.Instant.from(event.start_at).toZonedDateTimeISO(KST);
    end = Temporal.Instant.from(event.end_at).toZonedDateTimeISO(KST);
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
