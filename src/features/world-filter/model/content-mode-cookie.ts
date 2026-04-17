import { cookies } from 'next/headers';
import { CONTENT_MODE_COOKIE_KEY, parseContentMode, type ContentMode } from './content-mode';

export const CONTENT_MODE_COOKIE_MAX_AGE = 31_536_000;

export async function getContentModeFromCookies(): Promise<ContentMode> {
  const cookieStore = await cookies();
  return parseContentMode(cookieStore.get(CONTENT_MODE_COOKIE_KEY)?.value);
}

export async function setContentModeCookie(value: string | null | undefined): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CONTENT_MODE_COOKIE_KEY, parseContentMode(value), {
    path: '/',
    sameSite: 'lax',
    maxAge: CONTENT_MODE_COOKIE_MAX_AGE,
  });
}
