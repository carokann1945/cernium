'use client';

interface NavProps {
  isOpen: boolean;
}

export default function Nav({ isOpen }: NavProps) {
  if (!isOpen) return null;

  return (
    <nav className="bg-[var(--color-custom-nav-bg)] border-t border-white/5 px-4 py-4">
      {/* Navigation items will go here */}
    </nav>
  );
}
