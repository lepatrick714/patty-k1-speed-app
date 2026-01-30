'use client';

import { useQuery } from '@tanstack/react-query';
import { racesApi } from '../lib/api';

export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: () => racesApi.getTracks(),
  });
}
