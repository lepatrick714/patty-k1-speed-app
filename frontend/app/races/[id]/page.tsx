'use client';

import { use } from 'react';
import { useRace } from '../../../hooks/useRaces';
import { Navigation } from '../../../components/Navigation';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { RaceTable } from '../../../components/RaceTable';
import Link from 'next/link';

export default function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useRace(id);

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
        <ErrorMessage message="Failed to load race details" />
      </div>
    </>
  );

  const race = data.data;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/races" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Back to all races
            </Link>
          </div>
          
          <RaceTable race={race} />
        </div>
      </main>
    </>
  );
}
