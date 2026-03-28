import { Temporal } from '@js-temporal/polyfill';

export interface Event {
  id: string;
  name: string;
  image_url: string | null;
  event_period: string | null;
  fetched_at: string;
  gms_url: string | null;
  kms_url: string | null;
}

export interface ChartEvent {
  id: string;
  name: string;
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate;
  gms_url: string | null;
}
