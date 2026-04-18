import { describe, expect, it } from 'vitest';
import {
  filterByGameVersion,
  matchesGameVersion,
  parseGameVersion,
  type GameVersion,
} from './game-version';

describe('parseGameVersion', () => {
  it('유효한 game version 값을 그대로 반환한다', () => {
    expect(parseGameVersion('all')).toBe('all');
    expect(parseGameVersion('gms')).toBe('gms');
    expect(parseGameVersion('classic')).toBe('classic');
  });

  it('값이 없거나 잘못되면 all을 반환한다', () => {
    expect(parseGameVersion(undefined)).toBe('all');
    expect(parseGameVersion(null)).toBe('all');
    expect(parseGameVersion('unknown')).toBe('all');
  });
});

describe('matchesGameVersion', () => {
  it.each<[GameVersion, boolean | null, boolean]>([
    ['all', true, true],
    ['all', false, true],
    ['all', null, true],
    ['gms', true, false],
    ['gms', false, true],
    ['gms', null, true],
    ['classic', true, true],
    ['classic', false, false],
    ['classic', null, false],
  ])('%s 버전에서 is_mscw=%s 일 때 %s를 반환한다', (gameVersion, isMscw, expected) => {
    expect(matchesGameVersion(isMscw, gameVersion)).toBe(expected);
  });
});

describe('filterByGameVersion', () => {
  const items = [
    { id: 'classic', is_mscw: true },
    { id: 'gms', is_mscw: false },
    { id: 'unknown', is_mscw: null },
  ];

  it('gms 버전에서 false와 null만 남긴다', () => {
    expect(filterByGameVersion(items, 'gms').map((item) => item.id)).toEqual(['gms', 'unknown']);
  });

  it('classic 버전에서 true만 남긴다', () => {
    expect(filterByGameVersion(items, 'classic').map((item) => item.id)).toEqual(['classic']);
  });

  it('all 버전에서 전체를 유지한다', () => {
    expect(filterByGameVersion(items, 'all').map((item) => item.id)).toEqual(['classic', 'gms', 'unknown']);
  });
});
