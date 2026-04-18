import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENT_CACHE_TAG, fetchEvent } from './fetch-event';

const { cacheLifeMock, cacheTagMock, createClientMock, fromMock, orderMock, selectMock } = vi.hoisted(() => {
  const orderMock = vi.fn();
  const selectMock = vi.fn(() => ({ order: orderMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  const createClientMock = vi.fn(() => ({ from: fromMock }));

  return {
    cacheLifeMock: vi.fn(),
    cacheTagMock: vi.fn(),
    createClientMock,
    fromMock,
    orderMock,
    selectMock,
  };
});

vi.mock('next/cache', () => ({
  cacheLife: cacheLifeMock,
  cacheTag: cacheTagMock,
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: createClientMock,
}));

describe('fetchEvent', () => {
  const rows = [
    {
      id: 'event-1',
      name: 'GMS Event',
      is_mscw: false,
      live_date: '2026-04-10T00:00:00Z',
      start_at: '2026-04-11T00:00:00Z',
      end_at: '2026-04-12T00:00:00Z',
      gms_url: 'https://www.nexon.com/maplestory/news/events/1',
      image_thumbnail: 'https://example.com/event-1.png',
      summary: 'summary-1',
    },
    {
      id: 'event-2',
      name: 'Unknown Event',
      is_mscw: null,
      live_date: '2026-04-09T00:00:00Z',
      start_at: '2026-04-10T00:00:00Z',
      end_at: '2026-04-11T00:00:00Z',
      gms_url: null,
      image_thumbnail: null,
      summary: null,
    },
    {
      id: 'event-3',
      name: 'Classic Event',
      is_mscw: true,
      live_date: '2026-04-08T00:00:00Z',
      start_at: '2026-04-09T00:00:00Z',
      end_at: '2026-04-10T00:00:00Z',
      gms_url: 'https://www.nexon.com/maplestory/news/events/3',
      image_thumbnail: null,
      summary: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    createClientMock.mockReturnValue({ from: fromMock });
    fromMock.mockReturnValue({ select: selectMock });
    selectMock.mockReturnValue({ order: orderMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('all 모드에서는 전체 데이터를 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: rows,
      error: null,
    });

    const events = await fetchEvent('all');

    expect(cacheTagMock).toHaveBeenCalledWith(EVENT_CACHE_TAG);
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 3600, revalidate: 3600, expire: 86400 });
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith('events_v2');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(orderMock).toHaveBeenCalledWith('live_date', { ascending: false });
    expect(events).toEqual(rows);
  });

  it('gms 모드에서는 false와 null만 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: rows,
      error: null,
    });

    const events = await fetchEvent('gms');

    expect(events?.map((item) => item.id)).toEqual(['event-1', 'event-2']);
  });

  it('classic 모드에서는 true만 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: rows,
      error: null,
    });

    const events = await fetchEvent('classic');

    expect(events?.map((item) => item.id)).toEqual(['event-3']);
  });

  it('data가 null이면 null을 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: null,
      error: null,
    });

    await expect(fetchEvent('all')).resolves.toBeNull();
  });

  it('Supabase 오류가 나면 console.error를 남기고 null을 반환한다', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    orderMock.mockResolvedValue({
      data: null,
      error: { message: 'boom' },
    });

    await expect(fetchEvent('all')).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('[events_v2] Supabase query failed:', 'boom');
  });
});
