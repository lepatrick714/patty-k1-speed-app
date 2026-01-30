'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ParsedRaceEmail } from '../lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  races: ParsedRaceEmail[];
  racerName: string;
}

export function PerformanceChart({ races, racerName }: PerformanceChartProps) {
  // Extract data for the selected racer
  const chartData = races
    .map(race => {
      const racerResult = race.results.find(r => r.racer === racerName);
      return {
        date: race.raceInfo.date,
        time: racerResult ? parseFloat(racerResult.bestTime) : null,
      };
    })
    .filter(d => d.time !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const bestTime = Math.min(...chartData.map(d => d.time!));

  // Format date labels
  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const data = {
    labels: chartData.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Best Lap Time (seconds)',
        data: chartData.map(d => d.time),
        backgroundColor: chartData.map(d => 
          d.time === bestTime ? '#10B981' : '#3B82F6'
        ),
        borderColor: chartData.map(d => 
          d.time === bestTime ? '#059669' : '#2563EB'
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${racerName} - Best Lap Time Progression`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Time: ${context.parsed.y.toFixed(3)}s`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Best Lap Time (seconds)',
        },
        reverse: true, // Lower times are better
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2) + 's';
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Race Date',
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
