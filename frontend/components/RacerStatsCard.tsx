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
    <div className="bg-gray-700 rounded-lg shadow-xl p-6 h-full border border-gray-600">
      <h2 className="text-2xl font-bold text-gray-50 mb-6">{racerName}</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-600 pb-4">
          <div className="text-sm text-gray-300 mb-1">Track</div>
          <div className="text-lg font-semibold text-gray-50">{trackName}</div>
        </div>

        <div className="border-b border-gray-600 pb-4">
          <div className="text-sm text-gray-300 mb-1">Total Races</div>
          <div className="text-3xl font-bold text-blue-400">{races.length}</div>
        </div>

        <div className="border-b border-gray-600 pb-4">
          <div className="text-sm text-gray-300 mb-1">Best Time</div>
          <div className="text-3xl font-bold text-emerald-400">{bestTime.toFixed(3)}s</div>
        </div>

        <div className="border-b border-gray-600 pb-4">
          <div className="text-sm text-gray-300 mb-1">Average Time</div>
          <div className="text-2xl font-bold text-gray-50">{avgTime.toFixed(3)}s</div>
        </div>

        <div>
          <div className="text-sm text-gray-300 mb-1">Improvement</div>
          <div className="text-2xl font-bold text-emerald-400">-{improvement}%</div>
          <div className="text-xs text-gray-400 mt-1">
            From first race to best
          </div>
        </div>
      </div>
    </div>
  );
}
