import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { MAINTENANCES_CACHE_TAG, getCachedMaintenances } from './maintenances';

describe('getCachedMaintenances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createClientMock.mockReturnValue({ from: fromMock });
    fromMock.mockReturnValue({ select: selectMock });
    selectMock.mockReturnValue({ order: orderMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Supabase 성공 응답을 현재 규칙대로 정규화해 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: [
        {
          id: 'maintenance-1',
          name: 'Scheduled Maintenance',
          live_date: '2026-04-09 18:00:00+00',
          start_at: '2026-04-10 00:00:00+00',
          end_at: '2026-04-10 05:30:00+00',
          url: 'https://www.nexon.com/maplestory/news/maintenance/1',
        },
        {
          id: 'maintenance-2',
          name: 'Open Ended Maintenance',
          live_date: '2026-04-08T00:00:00Z',
          start_at: '2026-04-11T00:00:00Z',
          end_at: null,
          url: null,
        },
      ],
      error: null,
    });

    const maintenances = await getCachedMaintenances();

    expect(cacheTagMock).toHaveBeenCalledWith(MAINTENANCES_CACHE_TAG);
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 3600, revalidate: 3600, expire: 86400 });
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith('maintenance_v2');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(orderMock).toHaveBeenCalledWith('live_date', { ascending: false });

    expect(maintenances).toEqual([
      {
        id: 'maintenance-1',
        name: 'Scheduled Maintenance',
        live_date: '2026-04-09T18:00:00+00:00',
        start_at: '2026-04-10T00:00:00+00:00',
        end_at: '2026-04-10T05:30:00+00:00',
        url: 'https://www.nexon.com/maplestory/news/maintenance/1',
      },
      {
        id: 'maintenance-2',
        name: 'Open Ended Maintenance',
        live_date: '2026-04-08T00:00:00Z',
        start_at: '2026-04-11T00:00:00Z',
        end_at: null,
        url: null,
      },
    ]);
  });

  it('data가 null이면 null을 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: null,
      error: null,
    });

    await expect(getCachedMaintenances()).resolves.toBeNull();
  });

  it('Supabase 오류가 나면 console.error를 남기고 null을 반환한다', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    orderMock.mockResolvedValue({
      data: null,
      error: { message: 'boom' },
    });

    await expect(getCachedMaintenances()).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('[maintenances] Supabase query failed:', 'boom');
  });
});
