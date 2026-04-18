import { cn } from '@/lib/utils';

export function NewsSkeleton() {
  return (
    <section className="mx-auto mt-[60px] flex max-w-[1252px] flex-col gap-6">
      <div className="h-10 w-20 animate-pulse rounded bg-white/10" />
      <div className={cn('w-full', 'grid gap-3 grid-cols-[repeat(auto-fit,304px)]')}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[300px] w-[300px] animate-pulse rounded-md bg-white/10" />
        ))}
      </div>
    </section>
  );
}
