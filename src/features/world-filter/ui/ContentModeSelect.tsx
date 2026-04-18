'use client';

import { Select } from '@base-ui/react/select';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { setContentModeAction } from '../actions/set-content-mode';
import { CONTENT_MODE_OPTIONS, type ContentMode } from '../model/content-mode';

type Props = {
  value: ContentMode;
};

function ContentModeSelectField({ value }: Props) {
  const router = useRouter();
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOptimisticValue(value);
  }, [value]);

  const handleChange = (newValue: ContentMode | null) => {
    if (!newValue || newValue === optimisticValue) return;

    const previousValue = optimisticValue;
    setOptimisticValue(newValue);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set('contentMode', newValue);
        await setContentModeAction(fd);
        router.refresh();
      } catch {
        setOptimisticValue(previousValue);
      }
    });
  };

  const selectedLabel =
    CONTENT_MODE_OPTIONS.find((option) => option.value === optimisticValue)?.label ?? optimisticValue;

  return (
    <div className="relative font-glegoo">
      <span className="absolute -top-2 left-3 z-10 select-none bg-custom-bg px-1 text-xs text-sub-white">
        Game Version
      </span>

      <Select.Root value={optimisticValue} onValueChange={handleChange}>
        <Select.Trigger
          disabled={isPending}
          className="group flex min-w-[130px] cursor-pointer items-center justify-between gap-4 rounded-sm border border-white/40 bg-custom-nav-bg px-4 py-2 text-main-white disabled:cursor-not-allowed disabled:opacity-50">
          <span className="pointer-events-none text-main-white">{selectedLabel}</span>
          <Select.Icon className="flex text-sub-white transition-transform duration-300 group-data-[popup-open]:rotate-180">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false} side="bottom" sideOffset={1} className="z-50 outline-none">
            <Select.Popup
              className={cn(
                'min-w-[var(--anchor-width)] overflow-hidden rounded-sm',
                'bg-custom-nav-bg',
                'origin-[var(--transform-origin)]',
                'transition-[transform,scale,opacity] duration-200',
                'data-[starting-style]:scale-y-95 data-[starting-style]:opacity-0',
                'data-[ending-style]:scale-y-95 data-[ending-style]:opacity-0',
              )}>
              <Select.List className="cursor-pointer">
                {CONTENT_MODE_OPTIONS.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'flex select-none items-center px-4 py-2 outline-none',
                      'font-glegoo text-main-white',
                      'data-[highlighted]:bg-white/30',
                      'data-[selected]:bg-white/10',
                    )}>
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default function ContentModeSelect({ value }: Props) {
  return (
    <section className="mx-auto mt-6 flex max-w-[1252px] px-4 xl:px-0">
      <ContentModeSelectField value={value} />
    </section>
  );
}
