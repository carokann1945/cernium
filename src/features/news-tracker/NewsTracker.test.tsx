import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NewsTracker from './NewsTracker';
import { getCachedNews } from './model/news';

const { newsTrackerClientMock } = vi.hoisted(() => ({
  newsTrackerClientMock: vi.fn(({ news, lastUpdated }) => (
    <div data-last-updated={lastUpdated}>{news.map((item: { id: string }) => item.id).join(',')}</div>
  )),
}));

vi.mock('next/server', () => ({
  connection: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: Array<string | false | null | undefined>) => inputs.filter(Boolean).join(' '),
}));

vi.mock('./model/news', () => ({
  getCachedNews: vi.fn(),
}));

vi.mock('@/lib/cloudinary/fetch', () => ({
  toCloudinaryFetchUrl: vi.fn((src: string | null | undefined) => src ?? null),
}));

vi.mock('./ui/NewsTrackerClient', () => ({
  default: newsTrackerClientMock,
}));

function createNews(index: number) {
  return {
    id: `news-${String(index).padStart(2, '0')}`,
    created_at: `2026-04-${String(index + 8).padStart(2, '0')}T01:00:00Z`,
    name: `News ${index}`,
    is_mscw: null,
    live_date: `2026-04-${String(index + 8).padStart(2, '0')}T00:00:00Z`,
    url: `https://maplestory.nexon.net/news/${index}`,
    image_thumbnail: null,
    translation: index % 2 === 0 ? `번역 ${index}` : null,
  };
}

async function renderTracker(contentMode: 'all' | 'gms' | 'classic' = 'all'): Promise<string> {
  const element = await NewsTracker({ contentMode });
  return renderToStaticMarkup(element);
}

describe('NewsTracker', () => {
  const mockedGetCachedNews = vi.mocked(getCachedNews);

  beforeEach(() => {
    mockedGetCachedNews.mockReset();
    newsTrackerClientMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('데이터 조회 실패 시 에러 문구를 렌더링한다', async () => {
    mockedGetCachedNews.mockResolvedValue(null);

    const markup = await renderTracker('classic');

    expect(markup).toContain('뉴스 데이터를 불러오지 못했습니다.');
    expect(mockedGetCachedNews).toHaveBeenCalledWith('classic');
  });

  it('필터된 뉴스 기준으로 lastUpdated를 계산하고 최신 8개만 전달한다', async () => {
    mockedGetCachedNews.mockResolvedValue(Array.from({ length: 9 }, (_, index) => createNews(index + 1)));

    const markup = await renderTracker('gms');

    expect(mockedGetCachedNews).toHaveBeenCalledWith('gms');
    expect(markup).toContain('data-last-updated="2026.04.17"');
    expect(markup).toContain('news-09,news-08,news-07,news-06,news-05,news-04,news-03,news-02');
    expect(markup).not.toContain('news-01');
  });
});
