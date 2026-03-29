import { cn } from '@/lib/utils';
import MaintenanceStoreInitializer from './MaintenanceStoreInitializer';
import { getCachedMaintenances } from './model/maintenances';
import MaintenanceBanner from './ui/MaintenanceBanner';

export default async function MaintenanceTracker() {
  const maintenances = await getCachedMaintenances();

  if (maintenances === null) {
    return (
      <p className={cn('w-full', 'mt-2', 'text-center', 'text-sm')}>
        점검 데이터를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <>
      <MaintenanceStoreInitializer initialMaintenances={maintenances} />
      <MaintenanceBanner />
    </>
  );
}
