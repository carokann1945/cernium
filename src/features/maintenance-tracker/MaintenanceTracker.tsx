import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { cn } from '@/lib/utils';
import { getCachedMaintenances } from './model/maintenances';
import MaintenanceBanner from './ui/MaintenanceBanner';

function isUpcoming(endIso: string, now: Temporal.ZonedDateTime): boolean {
  try {
    const endZdt = Temporal.Instant.from(endIso).toZonedDateTimeISO('UTC');
    return Temporal.ZonedDateTime.compare(endZdt, now) > 0;
  } catch {
    return false;
  }
}

export default async function MaintenanceTracker() {
  await connection();
  const maintenances = await getCachedMaintenances();

  if (maintenances === null) {
    return <p className={cn('w-full', 'mt-2', 'text-center', 'text-sm')}>점검 데이터를 불러오지 못했습니다. (500)</p>;
  }

  const now = Temporal.Now.zonedDateTimeISO('UTC');
  const upcoming = maintenances.filter((m) => isUpcoming(m.end_at, now));

  return (
    <>
      <MaintenanceBanner upcoming={upcoming} />
    </>
  );
}
