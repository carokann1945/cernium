'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Nav from './Nav';

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn('bg-custom-nav-bg')}>
      <div className="w-full h-16 relative mx-auto flex items-center px-4 md:px-5">
        {/* Hamburger button — mobile only */}
        <button
          className={cn(
            'md:hidden w-10 h-10 flex items-center justify-center',
            'text-white/70 hover:text-white transition-colors',
          )}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        <div
          className={cn(
            'flex gap-[8px] items-center',
            'absolute left-1/2 -translate-x-1/2',
            'md:static md:translate-x-0 md:left-0',
            'cursor-pointer',
          )}>
          <figure className={cn('hidden md:inline w-[35px] h-[35px]', 'relative')}>
            <Image src="/images/Cernium.png" alt="logo image" fill sizes="50" className="object-cover" />
          </figure>
          <span className={cn('font-bold text-[24px] md:text-[32px] text-white tracking-tight')}>Cernium</span>
        </div>

        {/* Center spacer — desktop only, grows to push right content */}
        <div className="hidden md:block md:flex-1" />

        {/* Right area — empty, for future content */}
        <div className="hidden md:block" />
      </div>

      {/* Mobile navigation menu */}
      <Nav isOpen={isMenuOpen} />
    </header>
  );
}
