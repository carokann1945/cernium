export const CONTENT_MODE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'gms', label: 'GMS' },
  { value: 'classic', label: 'Classic' },
] as const;

export type ContentMode = (typeof CONTENT_MODE_OPTIONS)[number]['value'];

export const CONTENT_MODE_COOKIE_KEY = 'content_mode' as const;
export const DEFAULT_CONTENT_MODE: ContentMode = 'all';

export function parseContentMode(value: string | null | undefined): ContentMode {
  const matched = CONTENT_MODE_OPTIONS.find((option) => option.value === value);
  return matched?.value ?? DEFAULT_CONTENT_MODE;
}

export function matchesContentMode(isMscw: boolean | null, mode: ContentMode): boolean {
  if (mode === 'classic') {
    return isMscw === true;
  }

  if (mode === 'gms') {
    return isMscw === false || isMscw === null;
  }

  return true;
}

export function filterByContentMode<T extends { is_mscw: boolean | null }>(items: T[], mode: ContentMode): T[] {
  return items.filter((item) => matchesContentMode(item.is_mscw, mode));
}
