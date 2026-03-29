'use client';

import { cn } from '@/lib/utils';
import { useEventStore } from '../model/EventStore';
import type { SortOrder } from '../types/event';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '마감일 순' },
];

export function SortOrderToggle() {
  const sortOrder = useEventStore((state) => state.sortOrder);
  const setSortOrder = useEventStore((state) => state.setSortOrder);

  return (
    <div className={cn('flex', 'bg-custom-nav-bg', 'rounded-lg', 'p-1', 'gap-1')}>
      {SORT_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setSortOrder(value)}
          className={cn(
            'px-4 py-1.5',
            'rounded-md',
            'text-sm font-medium',
            'transition-colors duration-150',
            sortOrder === value ? 'bg-white/15 text-white' : 'text-custom-lightgray hover:text-white',
          )}>
          {label}
        </button>
      ))}
    </div>
  );
}
