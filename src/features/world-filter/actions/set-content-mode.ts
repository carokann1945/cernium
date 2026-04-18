'use server';

import { setContentModeCookie } from '../model/content-mode-cookie';

export async function setContentModeAction(formData: FormData) {
  const value = formData.get('contentMode');
  await setContentModeCookie(typeof value === 'string' ? value : null);
}
