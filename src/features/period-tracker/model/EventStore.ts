import { Temporal } from '@js-temporal/polyfill';
import { create } from 'zustand';
import type { Event, ChartEvent } from '../types/event';
import { isOngoingEvent, toChartEvents } from './event-utils';

type EventStore = {
  events: Event[];
  ongoingEvents: Event[];
  chartEvents: ChartEvent[];
  initialize: (params: { events: Event[]; now?: Temporal.ZonedDateTime }) => void;
};

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  ongoingEvents: [],
  chartEvents: [],

  initialize: ({ events }) => {
    const now = Temporal.Now.zonedDateTimeISO('UTC');
    const ongoingEvents = events.filter((event) => !!event.event_period && isOngoingEvent(event.event_period, now));

    set({
      events,
      ongoingEvents,
      chartEvents: toChartEvents(ongoingEvents),
    });
  },
}));
