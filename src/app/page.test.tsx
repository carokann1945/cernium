import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameVersion } from '@/features/game-version/model/game-version';
import { getGameVersionFromCookies } from '@/features/game-version/model/game-version-cookie';
import Home from './page';

type GameVersionComponentProps = {
  gameVersion: GameVersion;
};

type GameVersionSelectProps = {
  value: GameVersion;
};

const { eventServerMock, gameVersionSelectMock, maintenanceServerMock, newsServerMock } = vi.hoisted(() => ({
  eventServerMock: vi.fn(({ gameVersion }: GameVersionComponentProps) => <div data-event={gameVersion} />),
  gameVersionSelectMock: vi.fn(({ value }: GameVersionSelectProps) => <div data-selector={value} />),
  maintenanceServerMock: vi.fn(({ gameVersion }: GameVersionComponentProps) => <div data-maintenance={gameVersion} />),
  newsServerMock: vi.fn(({ gameVersion }: GameVersionComponentProps) => <div data-news={gameVersion} />),
}));

vi.mock('@/features/game-version/model/game-version-cookie', () => ({
  getGameVersionFromCookies: vi.fn(),
}));

vi.mock('@/features/game-version/ui/GameVersionSelect', () => ({
  default: gameVersionSelectMock,
}));

vi.mock('@/features/maintenance/MaintenanceServer', () => ({
  default: maintenanceServerMock,
}));

vi.mock('@/features/event/EventServer', () => ({
  default: eventServerMock,
}));

vi.mock('@/features/news/NewsServer', () => ({
  default: newsServerMock,
}));

vi.mock('@/features/maintenance/MaintenanceSkeleton', () => ({
  MaintenanceSkeleton: () => <div data-maintenance-skeleton="" />,
}));

vi.mock('@/features/event/EventSkeleton', () => ({
  EventSkeleton: () => <div data-event-skeleton="" />,
}));

vi.mock('@/features/news/NewsSkeleton', () => ({
  NewsSkeleton: () => <div data-news-skeleton="" />,
}));

describe('Home', () => {
  const mockedGetGameVersionFromCookies = vi.mocked(getGameVersionFromCookies);

  beforeEach(() => {
    mockedGetGameVersionFromCookies.mockReset();
    gameVersionSelectMock.mockClear();
    maintenanceServerMock.mockClear();
    eventServerMock.mockClear();
    newsServerMock.mockClear();
  });

  it('쿠키의 gameVersion을 선택기와 서버 컴포넌트들에 전달한다', async () => {
    mockedGetGameVersionFromCookies.mockResolvedValue('classic');

    const markup = renderToStaticMarkup(await Home());

    expect(markup).toContain('data-selector="classic"');
    expect(markup).toContain('data-maintenance="classic"');
    expect(markup).toContain('data-event="classic"');
    expect(markup).toContain('data-news="classic"');
  });
});
