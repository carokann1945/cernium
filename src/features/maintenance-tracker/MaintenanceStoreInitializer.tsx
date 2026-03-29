'use client';

import { useEffect } from 'react';
import { useMaintenanceStore } from './model/MaintenanceStore';
import type { Maintenance } from './types/maintenance';

type Props = { initialMaintenances: Maintenance[] };

export default function MaintenanceStoreInitializer({ initialMaintenances }: Props) {
  const initialize = useMaintenanceStore((state) => state.initialize);

  useEffect(() => {
    initialize({ maintenances: initialMaintenances });
  }, [initialMaintenances, initialize]);

  return null;
}
