import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setGameVersionCookie } from '../model/game-version-cookie';
import { setGameVersionAction } from './set-game-version';

vi.mock('../model/game-version-cookie', () => ({
  setGameVersionCookie: vi.fn(),
}));

describe('setGameVersionAction', () => {
  const mockedSetGameVersionCookie = vi.mocked(setGameVersionCookie);

  beforeEach(() => {
    mockedSetGameVersionCookie.mockReset();
  });

  it('gameVersion 필드를 읽어 쿠키 setter에 전달한다', async () => {
    const formData = new FormData();
    formData.set('gameVersion', 'classic');

    await setGameVersionAction(formData);

    expect(mockedSetGameVersionCookie).toHaveBeenCalledWith('classic');
  });

  it('문자열이 아니면 null을 전달한다', async () => {
    const formData = new FormData();
    formData.set('gameVersion', new Blob(['all'], { type: 'text/plain' }));

    await setGameVersionAction(formData);

    expect(mockedSetGameVersionCookie).toHaveBeenCalledWith(null);
  });
});
