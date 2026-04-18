import { EventSkeleton } from '@/features/event/EventSkeleton';
import { MaintenanceSkeleton } from '@/features/maintenance/MaintenanceSkeleton';
import { NewsTrackerSkeleton } from '@/features/news-tracker/NewsTrackerSkeleton';
import ContentModeSelect from '@/features/world-filter/ui/ContentModeSelect';

export default function Loading() {
  return (
    <>
      <ContentModeSelect value="all" />
      <MaintenanceSkeleton />
      <EventSkeleton />
      <NewsTrackerSkeleton />
    </>
  );
}
