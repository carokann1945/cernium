import { Temporal } from '@js-temporal/polyfill';
import { create } from 'zustand';
import type { Maintenance } from '../types/maintenance';

type MaintenanceStore = {
  upcoming: Maintenance[];
  isInitialized: boolean;
  initialize: (params: { maintenances: Maintenance[] }) => void;
};

function isUpcoming(endIso: string, now: Temporal.ZonedDateTime): boolean {
  try {
    const endZdt = Temporal.Instant.from(endIso).toZonedDateTimeISO('UTC');
    return Temporal.ZonedDateTime.compare(endZdt, now) > 0;
  } catch {
    return false;
  }
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  upcoming: [],
  isInitialized: false,

  initialize: ({ maintenances }) => {
    const now = Temporal.Now.zonedDateTimeISO('UTC');
    const upcoming = maintenances.filter((m) => isUpcoming(m.end_at, now));
    set({ upcoming, isInitialized: true });
  },
}));
