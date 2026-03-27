import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Event } from '../types/event';

export default async function EventLists() {
  const supabase = createClient();
  const { data: events, error } = await supabase.from('events').select('*');

  if (error) {
    console.error(error);
    return <p className={cn('w-full', 'mt-10', 'text-center')}>이벤트 데이터를 불러오지 못했습니다.</p>;
  }

  if (!events || events.length === 0) {
    return <p className={cn('w-full', 'mt-10', 'text-center')}>진행 중인 이벤트가 없습니다.</p>;
  }

  return (
    <ul>
      {(events as Event[]).map((event) => (
        <li key={event.id}>
          {event.image_url && (
            <Image
              src={`https://g.nexonstatic.com${event.image_url}`}
              alt={event.name}
              width={200}
              height={100}
            />
          )}
          {event.name}
        </li>
      ))}
    </ul>
  );
}
