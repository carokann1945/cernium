import { MaintenanceTrackerSkeleton } from '@/features/maintenance-tracker/MaintenanceTrackerSkeleton';
import { NewsTrackerSkeleton } from '@/features/news-tracker/NewsTrackerSkeleton';
import { PeriodTrackerSkeleton } from '@/features/period-tracker/PeriodTrackerSkeleton';
import ContentModeSelect from '@/features/world-filter/ui/ContentModeSelect';

export default function Loading() {
  return (
    <>
      <ContentModeSelect value="all" />
      <MaintenanceTrackerSkeleton />
      <PeriodTrackerSkeleton />
      <NewsTrackerSkeleton />
    </>
  );
}
