'use client';

import { useEffect } from 'react';
import { useEventStore } from './model/EventStore';
import type { Event } from './types/event';

type Props = {
  initialEvents: Event[];
};

export default function EventInitializer({ initialEvents }: Props) {
  const initialize = useEventStore((state) => state.initialize);

  useEffect(() => {
    initialize({ events: initialEvents });
  }, [initialEvents, initialize]);

  return null;
}
