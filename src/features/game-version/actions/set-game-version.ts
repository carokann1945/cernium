'use server';

import { setGameVersionCookie } from '../model/game-version-cookie';

export async function setGameVersionAction(formData: FormData) {
  const value = formData.get('gameVersion');
  await setGameVersionCookie(typeof value === 'string' ? value : null);
}
