import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it, vi } from 'vitest';
import type { Event, OngoingEventView } from '../types/event';
import {
  sortOngoingEvents,
  sortOngoingEventsByDeadline,
  sortOngoingEventsByLatest,
  toOngoingEventView,
} from './event-utils';

vi.mock('@/lib/cloudinary/fetch', () => ({
  toCloudinaryFetchUrl: vi.fn((src: string | null | undefined) => src ?? null),
}));

function createEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'event-1',
    name: 'Golden Giveaway',
    is_mscw: null,
    live_date: '2026-03-31T00:00:00Z',
    start_at: '2026-04-01T00:00:00Z',
    end_at: '2026-04-02T12:30:00Z',
    gms_url: 'https://www.nexon.com/maplestory/news/events/1',
    image_thumbnail: 'https://g.nexonstatic.com/maplestory/event-1.png',
    summary: 'summary',
    ...overrides,
  };
}

function createOngoingEventView(overrides: Partial<OngoingEventView> = {}): OngoingEventView {
  return {
    id: 'event-1',
    name: 'Golden Giveaway',
    live_date: '2026-03-31T00:00:00Z',
    image_thumbnail: 'https://g.nexonstatic.com/maplestory/event-1.png',
    gms_url: 'https://www.nexon.com/maplestory/news/events/1',
    summary: 'summary',
    periodKst: '04.01(수) 09:00 ~ 04.02(목) 21:30',
    startAtIso: '2026-04-01T00:00:00Z',
    endAtIso: '2026-04-02T12:30:00Z',
    ...overrides,
  };
}

describe('toOngoingEventView', () => {
  it('시작 시각이나 종료 시각이 없으면 null을 반환한다', () => {
    const now = Temporal.ZonedDateTime.from('2026-04-02T12:00:00+09:00[Asia/Seoul]');

    expect(toOngoingEventView(createEvent({ start_at: null }), now)).toBeNull();
    expect(toOngoingEventView(createEvent({ end_at: null }), now)).toBeNull();
  });

  it('잘못된 ISO 문자열이면 null을 반환한다', () => {
    const now = Temporal.ZonedDateTime.from('2026-04-02T12:00:00+09:00[Asia/Seoul]');

    expect(toOngoingEventView(createEvent({ start_at: 'not-an-iso' }), now)).toBeNull();
    expect(toOngoingEventView(createEvent({ end_at: 'not-an-iso' }), now)).toBeNull();
  });

  it('아직 시작하지 않은 이벤트면 null을 반환한다', () => {
    const now = Temporal.ZonedDateTime.from('2026-04-01T08:59:59+09:00[Asia/Seoul]');

    expect(toOngoingEventView(createEvent(), now)).toBeNull();
  });

  it('종료 시각과 같거나 지난 이벤트면 null을 반환한다', () => {
    const now = Temporal.ZonedDateTime.from('2026-04-02T21:30:00+09:00[Asia/Seoul]');

    expect(toOngoingEventView(createEvent(), now)).toBeNull();
  });

  it('진행 중 이벤트를 KST 문자열과 함께 변환한다', () => {
    const now = Temporal.ZonedDateTime.from('2026-04-02T12:00:00+09:00[Asia/Seoul]');

    expect(toOngoingEventView(createEvent(), now)).toEqual({
      id: 'event-1',
      name: 'Golden Giveaway',
      live_date: '2026-03-31T00:00:00Z',
      image_thumbnail: 'https://g.nexonstatic.com/maplestory/event-1.png',
      gms_url: 'https://www.nexon.com/maplestory/news/events/1',
      summary: 'summary',
      periodKst: '04.01(수) 09:00 ~ 04.02(목) 21:30',
      startAtIso: '2026-04-01T00:00:00Z',
      endAtIso: '2026-04-02T12:30:00Z',
    });
  });
});

describe('sortOngoingEventsByLatest', () => {
  it('live_date 기준 최신순으로 정렬하고 원본 배열은 유지한다', () => {
    const input = [
      createOngoingEventView({ id: 'older', live_date: '2026-03-30T00:00:00Z' }),
      createOngoingEventView({ id: 'missing', live_date: null }),
      createOngoingEventView({ id: 'newer', live_date: '2026-04-01T00:00:00Z' }),
    ];

    const sorted = sortOngoingEventsByLatest(input);

    expect(sorted.map((event) => event.id)).toEqual(['newer', 'older', 'missing']);
    expect(input.map((event) => event.id)).toEqual(['older', 'missing', 'newer']);
  });
});

describe('sortOngoingEventsByDeadline', () => {
  it('endAtIso 기준 종료일 빠른 순으로 정렬하고 원본 배열은 유지한다', () => {
    const input = [
      createOngoingEventView({ id: 'later', endAtIso: '2026-04-05T00:00:00Z' }),
      createOngoingEventView({ id: 'sooner', endAtIso: '2026-04-02T12:30:00Z' }),
      createOngoingEventView({ id: 'middle', endAtIso: '2026-04-03T12:30:00Z' }),
    ];

    const sorted = sortOngoingEventsByDeadline(input);

    expect(sorted.map((event) => event.id)).toEqual(['sooner', 'middle', 'later']);
    expect(input.map((event) => event.id)).toEqual(['later', 'sooner', 'middle']);
  });
});

describe('sortOngoingEvents', () => {
  const events = [
    createOngoingEventView({
      id: 'event-a',
      live_date: '2026-03-31T00:00:00Z',
      endAtIso: '2026-04-04T00:00:00Z',
    }),
    createOngoingEventView({
      id: 'event-b',
      live_date: '2026-04-02T00:00:00Z',
      endAtIso: '2026-04-02T12:30:00Z',
    }),
  ];

  it('latest 정렬을 선택하면 최신순 결과를 반환한다', () => {
    expect(sortOngoingEvents(events, 'latest').map((event) => event.id)).toEqual(['event-b', 'event-a']);
  });

  it('deadline 정렬을 선택하면 종료일 빠른 순 결과를 반환한다', () => {
    expect(sortOngoingEvents(events, 'deadline').map((event) => event.id)).toEqual(['event-b', 'event-a']);
  });
});
