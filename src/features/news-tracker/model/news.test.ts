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

import { getCachedNews, NEWS_CACHE_TAG } from './news';

describe('getCachedNews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createClientMock.mockReturnValue({ from: fromMock });
    fromMock.mockReturnValue({ select: selectMock });
    selectMock.mockReturnValue({ order: orderMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Supabase 성공 응답을 그대로 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: [
        {
          id: 'news-1',
          created_at: '2026-04-10T00:00:00Z',
          name: 'MapleStory Update',
          live_date: '2026-04-10T00:00:00Z',
          url: 'https://maplestory.nexon.net/news/1',
          image_thumbnail: 'https://example.com/thumbnail.png',
          translation: '메이플스토리 업데이트',
        },
        {
          id: 'news-2',
          created_at: '2026-04-08T00:00:00Z',
          name: null,
          live_date: null,
          url: null,
          image_thumbnail: null,
          translation: null,
        },
      ],
      error: null,
    });

    const news = await getCachedNews();

    expect(cacheTagMock).toHaveBeenCalledWith(NEWS_CACHE_TAG);
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 3600, revalidate: 3600, expire: 86400 });
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith('news');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(orderMock).toHaveBeenCalledWith('live_date', { ascending: false });

    expect(news).toEqual([
      {
        id: 'news-1',
        created_at: '2026-04-10T00:00:00Z',
        name: 'MapleStory Update',
        live_date: '2026-04-10T00:00:00Z',
        url: 'https://maplestory.nexon.net/news/1',
        image_thumbnail: 'https://example.com/thumbnail.png',
        translation: '메이플스토리 업데이트',
      },
      {
        id: 'news-2',
        created_at: '2026-04-08T00:00:00Z',
        name: null,
        live_date: null,
        url: null,
        image_thumbnail: null,
        translation: null,
      },
    ]);
  });

  it('data가 null이면 null을 반환한다', async () => {
    orderMock.mockResolvedValue({
      data: null,
      error: null,
    });

    await expect(getCachedNews()).resolves.toBeNull();
  });

  it('Supabase 오류가 나면 console.error를 남기고 null을 반환한다', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    orderMock.mockResolvedValue({
      data: null,
      error: { message: 'boom' },
    });

    await expect(getCachedNews()).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('[news] Supabase query failed:', 'boom');
  });
});
