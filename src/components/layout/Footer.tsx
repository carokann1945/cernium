import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className={cn('bg-custom-nav-bg border-t border-white/10 mt-[100px]')}>
      <div className={cn('w-full mx-auto px-4 md:px-5 py-8', 'flex flex-col items-center gap-3')}>
        <div className={cn('flex gap-2 items-center')}>
          <figure className={cn('relative w-[24px] h-[24px]')}>
            <Image src="/images/Cernium.png" alt="Cernium logo" fill sizes="24px" className="object-cover" />
          </figure>
          <span className={cn('font-bold text-[16px] text-white')}>Cernium</span>
        </div>
        <div className={cn('flex flex-col items-center gap-1 text-custom-lightgray text-[12px]')}>
          <p>by Kronos@Kwancha</p>
          <p>© NEXON Corporation. All Rights Reserved.</p>
          <p>본 사이트는 넥슨과 공식적으로 관련이 없습니다.</p>
          <p>데이터 및 이미지 출처: Nexon</p>
        </div>
      </div>
    </footer>
  );
}
