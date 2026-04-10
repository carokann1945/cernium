'use client';

import { cn } from '@/lib/utils';
import type { SortOrder } from '../types/event';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '종료일 순' },
];

type Props = {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
};

export function SortOrderToggle({ value, onChange }: Props) {
  return (
    <div className={cn('flex gap-1', 'bg-custom-nav-bg rounded-lg', 'ml-3 sm:ml-0 p-1')}>
      {SORT_OPTIONS.map(({ value: optionValue, label }) => (
        <button
          key={optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            'px-4 py-1.5',
            'rounded-md',
            'text-sm font-medium',
            'transition-colors duration-150 cursor-pointer',
            value === optionValue ? 'bg-white/15' : 'text-sub-white hover:text-main-white',
          )}>
          {label}
        </button>
      ))}
    </div>
  );
}
