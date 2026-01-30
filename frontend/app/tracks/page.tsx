'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '../../components/Navigation';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { PerformanceChart } from '../../components/PerformanceChart';
import { RacerStatsCard } from '../../components/RacerStatsCard';
import { useRaces } from '../../hooks/useRaces';
import { useTracks } from '../../hooks/useTracks';

export default function TracksPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [selectedRacer, setSelectedRacer] = useState<string>('');

  // Fetch all data
  const { data: tracksData, isLoading: tracksLoading, error: tracksError } = useTracks();
  const { data: racesData, isLoading: racesLoading, error: racesError } = useRaces({ limit: 1000 });

  // Get available tracks
  const tracks = tracksData?.data || [];

  // Filter races by selected track
  const filteredRaces = useMemo(() => {
    if (!selectedTrack || !racesData?.data) return [];
    
    const [location, track] = selectedTrack.split(' - ');
    return racesData.data.filter(race => 
      race.raceInfo.location === location && race.raceInfo.track === track
    );
  }, [selectedTrack, racesData]);

  // Get unique racers for selected track
  const availableRacers = useMemo(() => {
    if (!selectedTrack || filteredRaces.length === 0) return [];
    
    const racersSet = new Set<string>();
    filteredRaces.forEach(race => {
      race.results.forEach(result => {
        racersSet.add(result.racer);
      });
    });
    
    return Array.from(racersSet).sort();
  }, [selectedTrack, filteredRaces]);

  // Handle track selection
  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
    setSelectedRacer(''); // Reset racer when track changes
  };

  // Handle racer selection
  const handleRacerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRacer(e.target.value);
  };

  if (tracksLoading || racesLoading) {
    return (
      <>
        <Navigation />
        <LoadingSpinner />
      </>
    );
  }

  if (tracksError || racesError) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Failed to load track data" />
        </div>
      </>
    );
  }

  const showGraph = selectedTrack && selectedRacer;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-50 mb-6">
            Track Performance Analysis
          </h1>

          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '800px' }}>
            {/* Left Panel - Stats Card (1/3 width) */}
            <div className="w-full lg:w-1/3">
              {showGraph ? (
                <RacerStatsCard
                  racerName={selectedRacer}
                  races={filteredRaces}
                  trackName={selectedTrack}
                />
              ) : (
                <div className="bg-gray-700 rounded-lg shadow-xl p-6 h-full border border-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-300">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-gray-300">Select a track and racer to view statistics</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section (2/3 width) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
              {/* Selectors Panel (10% height) */}
              <div className="bg-gray-700 rounded-lg shadow-xl p-6 border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Track Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Track
                    </label>
                    <select
                      value={selectedTrack}
                      onChange={handleTrackChange}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-blue-500 text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 transition-all"
                    >
                      <option value="" className="bg-gray-800 text-gray-400">Choose a track...</option>
                      {tracks.map((track) => (
                        <option key={track} value={track} className="bg-gray-800 text-gray-50">
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Racer Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Racer
                    </label>
                    <select
                      value={selectedRacer}
                      onChange={handleRacerChange}
                      disabled={!selectedTrack}
                      className={`w-full px-4 py-3 rounded-lg transition-all ${
                        !selectedTrack
                          ? 'bg-gray-900 border-2 border-gray-600 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 border-2 border-blue-500 text-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                      }`}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">
                        {selectedTrack ? 'Choose a racer...' : 'Select track first'}
                      </option>
                      {availableRacers.map((racer) => (
                        <option key={racer} value={racer} className="bg-gray-800 text-gray-50">
                          {racer}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Graph Panel (90% height) */}
              <div className="bg-gray-700 rounded-lg shadow-xl p-6 border border-gray-600" style={{ height: '650px' }}>
                {showGraph ? (
                  <PerformanceChart races={filteredRaces} racerName={selectedRacer} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-300">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-50">No data to display</p>
                      <p className="mt-2 text-gray-400">Please select a track and racer to view performance trends</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
