import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GAME_VERSION_COOKIE_MAX_AGE,
  getGameVersionFromCookies,
  setGameVersionCookie,
} from './game-version-cookie';

const { cookieStoreMock, cookiesMock } = vi.hoisted(() => ({
  cookieStoreMock: {
    get: vi.fn(),
    set: vi.fn(),
  },
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

describe('game-version-cookie', () => {
  beforeEach(() => {
    cookieStoreMock.get.mockReset();
    cookieStoreMock.set.mockReset();
    cookiesMock.mockResolvedValue(cookieStoreMock);
  });

  it('game_version 쿠키 값을 읽는다', async () => {
    cookieStoreMock.get.mockReturnValue({ value: 'classic' });

    await expect(getGameVersionFromCookies()).resolves.toBe('classic');
    expect(cookieStoreMock.get).toHaveBeenCalledWith('game_version');
  });

  it('잘못된 값이거나 새 키가 없으면 all을 반환한다', async () => {
    cookieStoreMock.get.mockReturnValue(undefined);

    await expect(getGameVersionFromCookies()).resolves.toBe('all');

    cookieStoreMock.get.mockReturnValue({ value: 'unknown' });

    await expect(getGameVersionFromCookies()).resolves.toBe('all');
  });

  it('기존 content_mode 쿠키만 남아 있어도 fallback 없이 all을 반환한다', async () => {
    cookieStoreMock.get.mockImplementation((key: string) => {
      if (key === 'game_version') {
        return undefined;
      }

      return { value: 'classic' };
    });

    await expect(getGameVersionFromCookies()).resolves.toBe('all');
    expect(cookieStoreMock.get).toHaveBeenCalledWith('game_version');
  });

  it('새 키에 정규화된 값을 저장한다', async () => {
    await setGameVersionCookie('unknown');

    expect(cookieStoreMock.set).toHaveBeenCalledWith('game_version', 'all', {
      path: '/',
      sameSite: 'lax',
      maxAge: GAME_VERSION_COOKIE_MAX_AGE,
    });
  });
});
