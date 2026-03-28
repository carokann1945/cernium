import { Temporal } from '@js-temporal/polyfill';
import type { Event, ChartEvent } from '../types/event';

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

// startDate, endDate가 있는 이벤트 객체 생성용
export function toChartEvent(event: Event): ChartEvent | null {
  if (!event.event_period) {
    return null;
  }

  const parsed = parseEventPeriod(event.event_period);
  if (!parsed) {
    return null;
  }

  return {
    id: event.id,
    name: event.name,
    startDate: parsed.start.withTimeZone(KST).toPlainDate(),
    endDate: parsed.end.withTimeZone(KST).toPlainDate(),
    gms_url: event.gms_url,
  };
}

export function toChartEvents(events: Event[]): ChartEvent[] {
  return events.map(toChartEvent).filter((event): event is ChartEvent => event !== null);
}
