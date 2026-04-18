export const GAME_VERSION_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'gms', label: 'GMS' },
  { value: 'classic', label: 'Classic' },
] as const;

export type GameVersion = (typeof GAME_VERSION_OPTIONS)[number]['value'];

export const GAME_VERSION_COOKIE_KEY = 'game_version' as const;
export const DEFAULT_GAME_VERSION: GameVersion = 'all';

export function parseGameVersion(value: string | null | undefined): GameVersion {
  const matched = GAME_VERSION_OPTIONS.find((option) => option.value === value);
  return matched?.value ?? DEFAULT_GAME_VERSION;
}

export function matchesGameVersion(isMscw: boolean | null, gameVersion: GameVersion): boolean {
  if (gameVersion === 'classic') {
    return isMscw === true;
  }

  if (gameVersion === 'gms') {
    return isMscw === false || isMscw === null;
  }

  return true;
}

export function filterByGameVersion<T extends { is_mscw: boolean | null }>(
  items: T[],
  gameVersion: GameVersion,
): T[] {
  return items.filter((item) => matchesGameVersion(item.is_mscw, gameVersion));
}
