'use client';

import { useState } from 'react';
import { useRacers } from '../../hooks/useRacers';
import { Navigation } from '../../components/Navigation';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import Link from 'next/link';

export default function RacersPage() {
  const { data, isLoading, error } = useRacers();
  const [search, setSearch] = useState('');

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
        <ErrorMessage message="Failed to load racers" />
      </div>
    </>
  );

  const racers = data?.data || [];
  const filteredRacers = racers.filter(racer =>
    racer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Racers</h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search racers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
              {filteredRacers.map((racer, idx) => (
                <Link
                  key={idx}
                  href={`/racers/${encodeURIComponent(racer)}`}
                  className="bg-white p-4 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{racer}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRacers.length} of {racers.length} racers
          </div>
        </div>
      </main>
    </>
  );
}
