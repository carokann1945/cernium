import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NewsServer from './NewsServer';
import { fetchNews } from './model/fetch-news';

const { newsClientMock } = vi.hoisted(() => ({
  newsClientMock: vi.fn(({ news, lastUpdated }) => (
    <div data-last-updated={lastUpdated}>{news.map((item: { id: string }) => item.id).join(',')}</div>
  )),
}));

vi.mock('next/server', () => ({
  connection: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: Array<string | false | null | undefined>) => inputs.filter(Boolean).join(' '),
}));

vi.mock('./model/fetch-news', () => ({
  fetchNews: vi.fn(),
}));

vi.mock('@/lib/cloudinary/fetch', () => ({
  toCloudinaryFetchUrl: vi.fn((src: string | null | undefined) => src ?? null),
}));

vi.mock('./ui/NewsClient', () => ({
  default: newsClientMock,
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

async function renderNews(gameVersion: 'all' | 'gms' | 'classic' = 'all'): Promise<string> {
  const element = await NewsServer({ gameVersion });
  return renderToStaticMarkup(element);
}

describe('News', () => {
  const mockedFetchNews = vi.mocked(fetchNews);

  beforeEach(() => {
    mockedFetchNews.mockReset();
    newsClientMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('데이터 조회 실패 시 에러 문구를 렌더링한다', async () => {
    mockedFetchNews.mockResolvedValue(null);

    const markup = await renderNews('classic');

    expect(markup).toContain('뉴스 데이터를 불러오지 못했습니다.');
    expect(mockedFetchNews).toHaveBeenCalledWith('classic');
  });

  it('필터된 뉴스 기준으로 lastUpdated를 계산하고 최신 8개만 전달한다', async () => {
    mockedFetchNews.mockResolvedValue(Array.from({ length: 9 }, (_, index) => createNews(index + 1)));

    const markup = await renderNews('gms');

    expect(mockedFetchNews).toHaveBeenCalledWith('gms');
    expect(markup).toContain('data-last-updated="2026.04.17"');
    expect(markup).toContain('news-09,news-08,news-07,news-06,news-05,news-04,news-03,news-02');
    expect(markup).not.toContain('news-01');
  });
});
