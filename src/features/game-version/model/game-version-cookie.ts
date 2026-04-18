import { cookies } from 'next/headers';
import { GAME_VERSION_COOKIE_KEY, parseGameVersion, type GameVersion } from './game-version';

export const GAME_VERSION_COOKIE_MAX_AGE = 31_536_000;

export async function getGameVersionFromCookies(): Promise<GameVersion> {
  const cookieStore = await cookies();
  return parseGameVersion(cookieStore.get(GAME_VERSION_COOKIE_KEY)?.value);
}

export async function setGameVersionCookie(value: string | null | undefined): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(GAME_VERSION_COOKIE_KEY, parseGameVersion(value), {
    path: '/',
    sameSite: 'lax',
    maxAge: GAME_VERSION_COOKIE_MAX_AGE,
  });
}
