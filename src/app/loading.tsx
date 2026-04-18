import { EventSkeleton } from '@/features/event/EventSkeleton';
import { MaintenanceTrackerSkeleton } from '@/features/maintenance-tracker/MaintenanceTrackerSkeleton';
import { NewsTrackerSkeleton } from '@/features/news-tracker/NewsTrackerSkeleton';
import ContentModeSelect from '@/features/world-filter/ui/ContentModeSelect';

export default function Loading() {
  return (
    <>
      <ContentModeSelect value="all" />
      <MaintenanceTrackerSkeleton />
      <EventSkeleton />
      <NewsTrackerSkeleton />
    </>
  );
}
