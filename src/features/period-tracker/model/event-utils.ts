import { Temporal } from '@js-temporal/polyfill';
import type { Event, OngoingEventView, SortOrder } from '../types/event';

type ParsedEventPeriod = {
  start: Temporal.ZonedDateTime;
  end: Temporal.ZonedDateTime;
};

const UTC = 'UTC';
const KST = 'Asia/Seoul';
const DAY_ABBRS = ['월', '화', '수', '목', '금', '토', '일'];

// "2026-02-04 00:00 (UTC)" → ZonedDateTime
function parseUtcString(value: string): Temporal.ZonedDateTime {
  const match = value.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+\(UTC\)/);

  if (!match) {
    throw new Error(`잘못된 event_period 형식: ${value}`);
  }

  const [, y, m, d, h, min] = match;

  return Temporal.ZonedDateTime.from({
    timeZone: UTC,
    year: Number(y),
    month: Number(m),
    day: Number(d),
    hour: Number(h),
    minute: Number(min),
  });
}

export function parseEventPeriod(eventPeriod: string): ParsedEventPeriod | null {
  try {
    const [startRaw, endRaw] = eventPeriod.split(' - ');
    if (!startRaw || !endRaw) return null;

    const start = parseUtcString(startRaw.trim());
    const end = parseUtcString(endRaw.trim());

    return { start, end };
  } catch {
    return null;
  }
}

export function isOngoingEvent(
  eventPeriod: string,
  now: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO(UTC),
): boolean {
  const parsed = parseEventPeriod(eventPeriod);
  if (!parsed) return false;

  return Temporal.ZonedDateTime.compare(now, parsed.start) >= 0 && Temporal.ZonedDateTime.compare(now, parsed.end) < 0;
}

export function formatEventPeriodToKST(eventPeriod: string): string {
  const parsed = parseEventPeriod(eventPeriod);
  if (!parsed) return '기간 정보 없음';

  const startKst = parsed.start.withTimeZone(KST);
  const endKst = parsed.end.withTimeZone(KST);

  return `${formatKST(startKst)} ~ ${formatKST(endKst)}`;
}

function formatKST(zdt: Temporal.ZonedDateTime): string {
  return `${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]}) ${pad(zdt.hour)}:${pad(zdt.minute)}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toOngoingEventView(event: Event, now: Temporal.ZonedDateTime): OngoingEventView | null {
  if (!event.event_period) return null;

  const parsed = parseEventPeriod(event.event_period);
  if (!parsed) return null;

  if (!isOngoingEvent(event.event_period, now)) return null;

  const periodKst = formatEventPeriodToKST(event.event_period);

  return {
    id: event.id,
    name: event.name,
    source_index: event.source_index,
    image_url: event.image_url,
    gms_url: event.gms_url,
    kms_url: event.kms_url,
    periodKst,
    startAtIso: parsed.start.toInstant().toString(),
    endAtIso: parsed.end.toInstant().toString(),
  };
}

export function sortOngoingEventsByLatest(events: OngoingEventView[]): OngoingEventView[] {
  return events.slice().sort((a, b) => b.source_index - a.source_index);
}

export function sortOngoingEventsByDeadline(events: OngoingEventView[]): OngoingEventView[] {
  return events.slice().sort((a, b) => {
    const endCmp = Temporal.Instant.compare(Temporal.Instant.from(a.endAtIso), Temporal.Instant.from(b.endAtIso));
    if (endCmp !== 0) return endCmp;
    return b.source_index - a.source_index;
  });
}

export function sortOngoingEvents(events: OngoingEventView[], order: SortOrder): OngoingEventView[] {
  return order === 'deadline' ? sortOngoingEventsByDeadline(events) : sortOngoingEventsByLatest(events);
}
