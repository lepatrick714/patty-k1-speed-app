'use client';

import { useQuery } from '@tanstack/react-query';
import { racersApi } from '../lib/api';

export function useRacers() {
  return useQuery({
    queryKey: ['racers'],
    queryFn: () => racersApi.getAll(),
  });
}

export function useRacerStats(name: string) {
  return useQuery({
    queryKey: ['racer', name],
    queryFn: () => racersApi.getStats(name),
    enabled: !!name,
  });
}
