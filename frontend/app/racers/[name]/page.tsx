'use client';

import { use } from 'react';
import { useRacerStats } from '../../../hooks/useRacers';
import { Navigation } from '../../../components/Navigation';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { format } from 'date-fns';
import Link from 'next/link';

export default function RacerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);
  const { data, isLoading, error } = useRacerStats(decodedName);

  if (isLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (error || !data?.data) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load racer stats" />
      </div>
    </>
  );

  const stats = data.data;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/racers" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Back to all racers
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{stats.racer}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Races</div>
              <div className="text-3xl font-bold text-gray-900">{stats.races}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Best Time</div>
              <div className="text-3xl font-bold text-gray-900">{stats.bestTime}s</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Avg Position</div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgPosition}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Wins</div>
              <div className="text-3xl font-bold text-gray-900">{stats.wins || 0}</div>
            </div>
          </div>

          {/* Race History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-800 text-white">
              <h2 className="text-2xl font-bold">Race History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Best Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Laps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.results?.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(result.date), 'PP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${
                          result.position === 1 ? 'text-yellow-600' :
                          result.position === 2 ? 'text-gray-500' :
                          result.position === 3 ? 'text-amber-700' :
                          'text-gray-900'
                        }`}>
                          #{result.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {result.bestTime}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {result.laps}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
