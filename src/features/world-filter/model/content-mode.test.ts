import { describe, expect, it } from 'vitest';
import {
  filterByContentMode,
  matchesContentMode,
  parseContentMode,
  type ContentMode,
} from './content-mode';

describe('parseContentMode', () => {
  it('유효한 content mode 값을 그대로 반환한다', () => {
    expect(parseContentMode('all')).toBe('all');
    expect(parseContentMode('gms')).toBe('gms');
    expect(parseContentMode('classic')).toBe('classic');
  });

  it('값이 없거나 잘못되면 all을 반환한다', () => {
    expect(parseContentMode(undefined)).toBe('all');
    expect(parseContentMode(null)).toBe('all');
    expect(parseContentMode('unknown')).toBe('all');
  });
});

describe('matchesContentMode', () => {
  it.each<[ContentMode, boolean | null, boolean]>([
    ['all', true, true],
    ['all', false, true],
    ['all', null, true],
    ['gms', true, false],
    ['gms', false, true],
    ['gms', null, true],
    ['classic', true, true],
    ['classic', false, false],
    ['classic', null, false],
  ])('%s 모드에서 is_mscw=%s 일 때 %s를 반환한다', (mode, isMscw, expected) => {
    expect(matchesContentMode(isMscw, mode)).toBe(expected);
  });
});

describe('filterByContentMode', () => {
  const items = [
    { id: 'classic', is_mscw: true },
    { id: 'gms', is_mscw: false },
    { id: 'unknown', is_mscw: null },
  ];

  it('gms 모드에서 false와 null만 남긴다', () => {
    expect(filterByContentMode(items, 'gms').map((item) => item.id)).toEqual(['gms', 'unknown']);
  });

  it('classic 모드에서 true만 남긴다', () => {
    expect(filterByContentMode(items, 'classic').map((item) => item.id)).toEqual(['classic']);
  });

  it('all 모드에서 전체를 유지한다', () => {
    expect(filterByContentMode(items, 'all').map((item) => item.id)).toEqual(['classic', 'gms', 'unknown']);
  });
});
