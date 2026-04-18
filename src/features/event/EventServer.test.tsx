import { Temporal } from '@js-temporal/polyfill';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EventServer from './EventServer';
import { fetchEvent } from './model/fetch-event';
import type { Event } from './types/event';

const { eventClientMock } = vi.hoisted(() => ({
  eventClientMock: vi.fn(({ events, initialNowIso }) => (
    <div data-now={initialNowIso}>{events.map((event: { id: string }) => event.id).join(',')}</div>
  )),
}));

vi.mock('next/server', () => ({
  connection: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: Array<string | false | null | undefined>) => inputs.filter(Boolean).join(' '),
}));

vi.mock('./model/fetch-event', () => ({
  fetchEvent: vi.fn(),
}));

vi.mock('@/lib/cloudinary/fetch', () => ({
  toCloudinaryFetchUrl: vi.fn((src: string | null | undefined) => src ?? null),
}));

vi.mock('./ui/EventClient', () => ({
  default: eventClientMock,
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
    image_thumbnail: 'https://example.com/event-1.png',
    summary: 'summary',
    ...overrides,
  };
}

async function renderEvent(gameVersion: 'all' | 'gms' | 'classic' = 'all'): Promise<string> {
  const element = await EventServer({ gameVersion });
  return renderToStaticMarkup(element);
}

describe('Event', () => {
  const mockedFetchEvent = vi.mocked(fetchEvent);

  beforeEach(() => {
    mockedFetchEvent.mockReset();
    eventClientMock.mockClear();
    vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(
      Temporal.ZonedDateTime.from('2026-04-02T12:00:00+09:00[Asia/Seoul]'),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('데이터 조회 실패 시 에러 문구를 렌더링한다', async () => {
    mockedFetchEvent.mockResolvedValue(null);

    const markup = await renderEvent('classic');

    expect(markup).toContain('이벤트 데이터를 불러오지 못했습니다.');
    expect(mockedFetchEvent).toHaveBeenCalledWith('classic');
  });

  it('필터된 데이터에서 진행 중인 이벤트만 클라이언트에 전달한다', async () => {
    mockedFetchEvent.mockResolvedValue([
      createEvent({ id: 'ongoing-event' }),
      createEvent({
        id: 'future-event',
        start_at: '2026-04-02T04:00:00Z',
        end_at: '2026-04-03T04:00:00Z',
      }),
      createEvent({
        id: 'ended-event',
        start_at: '2026-03-31T00:00:00Z',
        end_at: '2026-04-02T03:00:00Z',
      }),
      createEvent({
        id: 'invalid-event',
        start_at: 'not-an-iso',
        end_at: '2026-04-03T00:00:00Z',
      }),
    ]);

    const markup = await renderEvent('gms');

    expect(mockedFetchEvent).toHaveBeenCalledWith('gms');
    expect(markup).toContain('data-now="2026-04-02T12:00:00+09:00[Asia/Seoul]"');
    expect(markup).toContain('ongoing-event');
    expect(markup).not.toContain('future-event');
    expect(markup).not.toContain('ended-event');
    expect(markup).not.toContain('invalid-event');
  });
});
