import { Temporal } from '@js-temporal/polyfill';
import { create } from 'zustand';
import type { Event, ChartEvent, SortOrder } from '../types/event';
import { isOngoingEvent, sortEvents, toChartEvents } from './event-utils';

type EventStore = {
  events: Event[];
  ongoingEvents: Event[];
  chartEvents: ChartEvent[];
  sortOrder: SortOrder;
  initialize: (params: { events: Event[]; now?: Temporal.ZonedDateTime }) => void;
  setSortOrder: (order: SortOrder) => void;
  isInitialized: boolean;
};

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  ongoingEvents: [],
  chartEvents: [],
  sortOrder: 'latest',
  isInitialized: false,

  initialize: ({ events }) => {
    const now = Temporal.Now.zonedDateTimeISO('UTC');
    const ongoingEvents = sortEvents(
      events.filter((event) => !!event.event_period && isOngoingEvent(event.event_period, now)),
      'latest',
    );

    set({
      events,
      ongoingEvents,
      chartEvents: toChartEvents(ongoingEvents),
      sortOrder: 'latest',
      isInitialized: true,
    });
  },

  setSortOrder: (order) => {
    set((state) => {
      const now = Temporal.Now.zonedDateTimeISO('UTC');
      const ongoingEvents = sortEvents(
        state.events.filter((event) => !!event.event_period && isOngoingEvent(event.event_period, now)),
        order,
      );
      return {
        sortOrder: order,
        ongoingEvents,
        chartEvents: toChartEvents(ongoingEvents),
      };
    });
  },
}));
