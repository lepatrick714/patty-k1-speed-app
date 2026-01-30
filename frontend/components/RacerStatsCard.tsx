'use client';

import { ParsedRaceEmail } from '../lib/types';

interface RacerStatsCardProps {
  racerName: string;
  races: ParsedRaceEmail[];
  trackName: string;
}

export function RacerStatsCard({ racerName, races, trackName }: RacerStatsCardProps) {
  // Calculate statistics
  const racerResults = races
    .map(race => race.results.find(r => r.racer === racerName))
    .filter(r => r !== undefined);

  const times = racerResults.map(r => parseFloat(r!.bestTime));
  const bestTime = Math.min(...times);
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const firstTime = times[0];
  const improvement = ((firstTime - bestTime) / firstTime * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{racerName}</h2>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="text-sm text-gray-500 mb-1">Track</div>
          <div className="text-lg font-semibold text-gray-900">{trackName}</div>
        </div>

        <div className="border-b pb-4">
          <div className="text-sm text-gray-500 mb-1">Total Races</div>
          <div className="text-3xl font-bold text-blue-600">{races.length}</div>
        </div>

        <div className="border-b pb-4">
          <div className="text-sm text-gray-500 mb-1">Best Time</div>
          <div className="text-3xl font-bold text-green-600">{bestTime.toFixed(3)}s</div>
        </div>

        <div className="border-b pb-4">
          <div className="text-sm text-gray-500 mb-1">Average Time</div>
          <div className="text-2xl font-bold text-gray-700">{avgTime.toFixed(3)}s</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Improvement</div>
          <div className="text-2xl font-bold text-purple-600">-{improvement}%</div>
          <div className="text-xs text-gray-500 mt-1">
            From first race to best
          </div>
        </div>
      </div>
    </div>
  );
}
