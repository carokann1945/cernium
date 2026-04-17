import { Temporal } from '@js-temporal/polyfill';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { News } from '../types/news';
import { toNewsView } from './news-utils';

vi.mock('@/lib/cloudinary/fetch', () => ({
  toCloudinaryFetchUrl: vi.fn((src: string | null | undefined) => src ?? null),
}));

function createNews(overrides: Partial<News> = {}): News {
  return {
    id: 'news-1',
    created_at: '2026-04-10T00:00:00Z',
    name: 'MapleStory Update',
    is_mscw: null,
    live_date: '2026-04-10T00:00:00Z',
    url: 'https://maplestory.nexon.net/news/1',
    image_thumbnail: 'https://example.com/thumbnail.png',
    translation: '메이플스토리 업데이트',
    ...overrides,
  };
}

// 기준 날짜: 2026-04-16(목) KST
const TODAY_KST = Temporal.PlainDate.from('2026-04-16');

describe('toNewsView', () => {
  beforeEach(() => {
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(TODAY_KST);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('live_date가 null이면 liveDateKst는 "-", isNew는 false이다', () => {
    const result = toNewsView(createNews({ live_date: null }));

    expect(result.liveDateKst).toBe('-');
    expect(result.isNew).toBe(false);
  });

  it('live_date가 잘못된 ISO 문자열이면 liveDateKst는 "-", isNew는 false이다', () => {
    const result = toNewsView(createNews({ live_date: 'not-a-date' }));

    expect(result.liveDateKst).toBe('-');
    expect(result.isNew).toBe(false);
  });

  it('정상 날짜를 "YYYY.MM.DD(요일)" 형식으로 변환한다', () => {
    // 2026-04-16T00:00:00Z → KST 2026-04-16(목)
    const result = toNewsView(createNews({ live_date: '2026-04-16T00:00:00Z' }));

    expect(result.liveDateKst).toBe('2026.04.16(목)');
  });

  it('오늘 기준 0~6일 전 뉴스는 isNew가 true이다', () => {
    // today = 2026-04-16, live_date = 2026-04-10 → diffDays = 6
    const result = toNewsView(createNews({ live_date: '2026-04-10T00:00:00Z' }));

    expect(result.isNew).toBe(true);
  });

  it('오늘 기준 7일 이상 전 뉴스는 isNew가 false이다', () => {
    // today = 2026-04-16, live_date = 2026-04-09 → diffDays = 7
    const result = toNewsView(createNews({ live_date: '2026-04-09T00:00:00Z' }));

    expect(result.isNew).toBe(false);
  });

  it('미래 날짜 뉴스는 isNew가 false이다', () => {
    // today = 2026-04-16, live_date = 2026-04-17 → diffDays = -1
    const result = toNewsView(createNews({ live_date: '2026-04-17T00:00:00Z' }));

    expect(result.isNew).toBe(false);
  });

  it('name이 null이면 빈 문자열로 변환한다', () => {
    const result = toNewsView(createNews({ name: null }));

    expect(result.name).toBe('');
  });

  it('필드 전체를 올바르게 변환한다', () => {
    const news = createNews({
      live_date: '2026-04-16T00:00:00Z',
    });

    expect(toNewsView(news)).toEqual({
      id: 'news-1',
      name: 'MapleStory Update',
      live_date: '2026-04-16T00:00:00Z',
      url: 'https://maplestory.nexon.net/news/1',
      image_thumbnail: 'https://example.com/thumbnail.png',
      translation: '메이플스토리 업데이트',
      liveDateKst: '2026.04.16(목)',
      isNew: true,
    });
  });
});
