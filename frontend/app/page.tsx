'use client';

import { useRaces } from '../hooks/useRaces';
import { useRacers } from '../hooks/useRacers';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import Link from 'next/link';

export default function HomePage() {
  const { data: racesData, isLoading: racesLoading, error: racesError } = useRaces({ limit: 5 });
  const { data: racersData } = useRacers();

  if (racesLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (racesError) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load race data" />
      </div>
    </>
  );

  const recentRaces = racesData?.data || [];
  const totalRacers = racersData?.data?.length || 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">K1 Speed Race History</h1>
            <p className="text-xl mb-6">
              Track your performance, view race history, and compare with other racers
            </p>
            <div className="flex gap-4">
              <Link
                href="/races"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View All Races
              </Link>
              <Link
                href="/racers"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Browse Racers
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Races</div>
              <div className="text-3xl font-bold text-gray-900">
                {racesData?.pagination?.total || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Racers</div>
              <div className="text-3xl font-bold text-gray-900">{totalRacers}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Recent Races</div>
              <div className="text-3xl font-bold text-gray-900">{recentRaces.length}</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Races</h2>
              <Link href="/races" className="text-blue-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRaces.slice(0, 3).map((race, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {race.raceInfo.location}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(race.raceInfo.date).toLocaleDateString()}
                  </p>
                  <div className="text-sm text-gray-700">
                    <strong>Winner:</strong> {race.results[0]?.racer}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Best Time:</strong> {race.results[0]?.bestTime}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
