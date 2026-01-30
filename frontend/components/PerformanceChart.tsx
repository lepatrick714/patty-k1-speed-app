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
        labels: {
          color: '#F9FAFB', // Gray-50
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `${racerName} - Best Lap Time Progression`,
        color: '#F9FAFB', // Gray-50
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937', // Gray-800
        titleColor: '#F9FAFB', // Gray-50
        bodyColor: '#D1D5DB', // Gray-300
        borderColor: '#4B5563', // Gray-600
        borderWidth: 1,
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
          color: '#F9FAFB', // Gray-50
        },
        reverse: true, // Lower times are better
        ticks: {
          color: '#D1D5DB', // Gray-300
          callback: function(value: any) {
            return value.toFixed(2) + 's';
          },
        },
        grid: {
          color: '#4B5563', // Gray-600
        },
      },
      x: {
        title: {
          display: true,
          text: 'Race Date',
          color: '#F9FAFB', // Gray-50
        },
        ticks: {
          color: '#D1D5DB', // Gray-300
        },
        grid: {
          color: '#4B5563', // Gray-600
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
