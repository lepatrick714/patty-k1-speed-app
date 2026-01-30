import { ParsedRaceEmail } from '../lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

interface RaceTableProps {
  race: ParsedRaceEmail;
}

export function RaceTable({ race }: RaceTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-4">
        <h2 className="text-2xl font-bold">{race.raceInfo.location}</h2>
        <p className="text-gray-300">
          {race.raceInfo.track} • {format(new Date(race.raceInfo.date), 'PPp')}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Racer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Best Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laps
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                K1RS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {race.results.map((result, idx) => (
              <tr 
                key={idx}
                className={`hover:bg-gray-50 transition-colors ${
                  result.position <= 3 ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-bold ${
                    result.position === 1 ? 'text-yellow-600' :
                    result.position === 2 ? 'text-gray-500' :
                    result.position === 3 ? 'text-amber-700' :
                    'text-gray-900'
                  }`}>
                    {result.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/racers/${encodeURIComponent(result.racer)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {result.racer}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {result.bestTime}s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.bestLap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.laps}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                  {result.avg}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                  {result.gap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.k1rs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
