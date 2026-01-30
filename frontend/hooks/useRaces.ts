'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { racesApi } from '../lib/api';

export function useRaces(params?: {
  location?: string;
  racerName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['races', params],
    queryFn: () => racesApi.getAll(params),
  });
}

export function useRace(id: string) {
  return useQuery({
    queryKey: ['race', id],
    queryFn: () => racesApi.getById(id),
    enabled: !!id,
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => racesApi.getLocations(),
  });
}

export function useRefreshRaces() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => racesApi.refresh(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
  });
}
