'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className={cn('bg-custom-nav-bg')}>
      <div className="w-full h-16 relative mx-auto flex items-center px-4 md:px-5">
        <div className={cn('flex gap-[8px] items-center', 'cursor-pointer')}>
          <figure className={cn('hidden sm:inline w-[35px] h-[35px]', 'relative')}>
            <Image src="/images/Cernium.png" alt="" fill sizes="35px" className="object-cover" />
          </figure>
          <span className={cn('font-bold text-[24px] md:text-[32px] text-white tracking-tight')}>Cernium</span>
        </div>

        {/* Center spacer — desktop only, grows to push right content */}
        <div className="hidden md:block md:flex-1" />

        {/* Right area — empty, for future content */}
        <div className="hidden md:block" />
      </div>
    </header>
  );
}
