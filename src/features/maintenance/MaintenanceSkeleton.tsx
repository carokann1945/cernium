export function MaintenanceSkeleton() {
  return (
    <section className="mx-auto mt-10 flex max-w-[1252px] flex-col gap-4">
      <div className="h-7 w-44 animate-pulse rounded bg-white/10" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-52 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-60 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </section>
  );
}
