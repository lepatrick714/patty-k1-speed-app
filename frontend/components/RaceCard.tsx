import { ParsedRaceEmail } from '../lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

interface RaceCardProps {
  race: ParsedRaceEmail;
  raceId: number;
}

export function RaceCard({ race, raceId }: RaceCardProps) {
  const topThree = race.results.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {race.raceInfo.location}
          </h3>
          <p className="text-sm text-gray-500">
            {race.raceInfo.track} • {format(new Date(race.raceInfo.date), 'PPp')}
          </p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {race.results.length} racers
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-700">Top 3</h4>
        {topThree.map((result, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 w-6">#{result.position}</span>
              <Link 
                href={`/racers/${encodeURIComponent(result.racer)}`}
                className="text-blue-600 hover:underline"
              >
                {result.racer}
              </Link>
            </div>
            <span className="font-mono text-gray-700">{result.bestTime}s</span>
          </div>
        ))}
      </div>

      <Link
        href={`/races/${raceId}`}
        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        View Full Results
      </Link>
    </div>
  );
}
