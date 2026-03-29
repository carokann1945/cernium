import Image from 'next/image';
import { cn } from '@/lib/utils';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function DiscordLink() {
  return (
    <a
      href="https://discord.gg/UG4wSwxRzk"
      title="디스코드"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'w-[90px] h-[30px]',
        'flex gap-[8px] items-center',
        'border border-custom-lightgray',
        'px-1 py-1 rounded-md',
        'text-white',
      )}>
      <DiscordIcon className="w-5 h-5" />
      <span className={cn('text-[12px] text-custom-lightgray')}>문의 제보</span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className={cn('bg-custom-nav-bg border-t border-white/10 mt-[100px]', 'flex')}>
      <div className={cn('w-[360px] md:w-[600px] mx-auto px-4 md:px-5 py-8', 'flex justify-between items-center')}>
        {/* 사이트 로고 */}
        <div className={cn('flex flex-col gap-3')}>
          <div className={cn('flex gap-2 items-center')}>
            <figure className={cn('relative w-[24px] h-[24px]')}>
              <Image src="/images/Cernium.png" alt="Cernium logo" fill sizes="24px" className="object-cover" />
            </figure>
            <span className={cn('font-bold text-[16px] text-white')}>Cernium</span>
          </div>
          {/* 모바일에서만 보임 */}
          <div className="md:hidden">
            <DiscordLink />
          </div>
          {/* 잡다한 내용 */}
          <div className={cn('flex flex-col gap-1 text-custom-lightgray text-[12px]')}>
            <p>by Kronos@Kwancha</p>
            <p>© NEXON Corporation. All Rights Reserved.</p>
            <p>본 사이트는 넥슨과 공식적으로 관련이 없습니다.</p>
            <p>데이터 및 이미지 출처: Nexon</p>
          </div>
        </div>

        {/* md 이상에서만 보임 */}
        <div className="hidden md:block">
          <DiscordLink />
        </div>
      </div>
    </footer>
  );
}
