import { EventSkeleton } from '@/features/event/EventSkeleton';
import { MaintenanceSkeleton } from '@/features/maintenance/MaintenanceSkeleton';
import { NewsSkeleton } from '@/features/news/NewsSkeleton';

export default function Loading() {
  return (
    <>
      <section className="mx-auto mt-6 flex max-w-[1252px] px-4 xl:px-0">
        <div className="relative font-glegoo">
          <span className="absolute -top-2 left-3 z-10 select-none bg-custom-bg px-1 text-xs text-sub-white">
            Game Version
          </span>
          <div className="flex min-w-[130px] items-center justify-between gap-4 rounded-sm border border-white/40 bg-custom-nav-bg px-4 py-2">
            <div className="h-5 w-12 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-4 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </section>
      <MaintenanceSkeleton />
      <EventSkeleton />
      <NewsSkeleton />
    </>
  );
}
