'use client';

import { useState } from 'react';
import { useRaces, useLocations } from '../../hooks/useRaces';
import { Navigation } from '../../components/Navigation';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { FilterBar } from '../../components/FilterBar';
import { RaceCard } from '../../components/RaceCard';

export default function RacesPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data: racesData, isLoading, error } = useRaces({ ...filters, page, limit: 12 });
  const { data: locationsData } = useLocations();

  if (isLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (error) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load races" />
      </div>
    </>
  );

  const races = racesData?.data || [];
  const pagination = racesData?.pagination;
  const locations = locationsData?.data || [];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Race History</h1>

          <FilterBar onFilterChange={setFilters} locations={locations} />

          {races.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No races found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {races.map((race, idx) => (
                  <RaceCard key={idx} race={race} raceId={idx} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
