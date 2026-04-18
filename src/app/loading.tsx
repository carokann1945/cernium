import { EventSkeleton } from '@/features/event/EventSkeleton';
import { MaintenanceSkeleton } from '@/features/maintenance/MaintenanceSkeleton';
import { NewsSkeleton } from '@/features/news/NewsSkeleton';
import ContentModeSelect from '@/features/world-filter/ui/ContentModeSelect';

export default function Loading() {
  return (
    <>
      <ContentModeSelect value="all" />
      <MaintenanceSkeleton />
      <EventSkeleton />
      <NewsSkeleton />
    </>
  );
}
