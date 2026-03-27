import EventLists from '@/features/period-tracker/ui/EventLists';
import EventPeriodChart from '@/features/period-tracker/ui/EventPeriodChart';

export default function Home() {
  return (
    <>
      <EventPeriodChart />
      <EventLists />
    </>
  );
}
