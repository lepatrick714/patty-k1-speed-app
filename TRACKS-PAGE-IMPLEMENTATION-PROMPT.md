# AI Implementation Prompt: K1 Speed Tracks Analysis Page

## 🎯 OBJECTIVE
Build a new `/tracks` page for the K1 Speed Race History application that displays racer performance trends over time with interactive track and racer selection.

---

### DON'T MAKE THIS MISTAKE AGAIN 

- Please do not `sleep 3` then `curl`. It won't work. 

## 📋 PREREQUISITE: EXPLORE EXISTING CODEBASE

**CRITICAL: Before starting implementation, you MUST:**

1. **Examine the current project structure:**
   ```bash
   # Navigate to the project root
   ls -la
   
   # Review existing pages
   ls -la frontend/app/
   ls -la frontend/app/races/
   ls -la frontend/app/racers/
   
   # Review existing components
   ls -la frontend/components/
   
   # Review hooks and API client
   ls -la frontend/hooks/
   cat frontend/lib/api.ts
   cat frontend/lib/types.ts
   ```

2. **Understand existing patterns:**
   - Read `frontend/app/page.tsx` - Study the home page structure
   - Read `frontend/app/races/page.tsx` - Understand data fetching patterns
   - Read `frontend/components/Navigation.tsx` - See existing navigation
   - Read `frontend/hooks/useRaces.ts` and `frontend/hooks/useRacers.ts` - Understand React Query usage
   - Read `backend/src/controllers/races.controller.ts` - Understand available API endpoints

3. **Identify what data is available:**
   - Review `backend/src/types/shared.types.ts` for data structures
   - Check what the API already provides (races, racers, locations)
   - Determine if new backend endpoints are needed

4. **List existing UI patterns:**
   - What Tailwind classes are being used
   - How loading states are handled (LoadingSpinner component)
   - How errors are displayed (ErrorMessage component)
   - Navigation structure and styling

---

## 🎨 DESIGN SPECIFICATION

### Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    Navigation Header                        │
│                   (Existing Component)                      │
├─────────────────────┬───────────────────────────────────────┤
│                     │  Track Selector  │  Racer Selector   │
│                     │  (10% height)                         │
│   Left Panel        ├───────────────────────────────────────┤
│   (1/3 width)       │                                       │
│                     │                                       │
│   Racer Statistics  │        Bar Graph                      │
│   Summary Card      │   Best Lap Time Progression           │
│                     │        (90% height)                   │
│                     │                                       │
│                     │   Y: Best Lap Time (seconds)          │
│                     │   X: Race Date                        │
│                     │                                       │
└─────────────────────┴───────────────────────────────────────┘
```

### Component Breakdown

#### 1. **Navigation Header** (Existing)
- Use existing `<Navigation />` component
- Add "Tracks" link to navigation

#### 2. **Left Panel - Racer Statistics Card** (1/3 width, full height)
- Display after racer is selected
- Show:
  - Racer name (large heading)
  - Total races at selected track
  - Best time at track
  - Average time at track
  - Improvement percentage (first race vs best race)
- Styling: White background, rounded corners, shadow, proper padding

#### 3. **Right Top Panel - Selectors** (2/3 width, 10% height)
- Two dropdown selectors side-by-side
- **Track Selector (Left)**
  - Dropdown with all available tracks/locations
  - Label: "Select Track"
  - Must be selected first
  - Shows loading state while fetching tracks
  
- **Racer Selector (Right)**
  - Dropdown with all racers who raced at selected track
  - Label: "Select Racer"
  - **DISABLED** until track is selected
  - Visual disabled state: gray background, cursor not-allowed
  - Enabled state: normal styling with hover effects
  - Shows filtered racers based on track selection

#### 4. **Right Bottom Panel - Performance Graph** (2/3 width, 90% height)
- **Library**: Chart.js with react-chartjs-2
- **Type**: Bar chart
- **Display Conditions**: Only render when BOTH track AND racer are selected
- **Before Selection**: Show placeholder with icon and text: "Please select a track and racer to view performance trends"
- **Axes**:
  - **Y-Axis**: Best lap time in seconds (e.g., 28.5, 29.0, 29.5)
  - **X-Axis**: Race date (formatted as "MMM DD, YYYY")
- **Data Points**: Each race at the selected track for the selected racer
- **Styling**:
  - Blue bars (#3B82F6)
  - Grid lines for readability
  - Tooltips showing exact time and date
  - Highlight best time in different color (green)
  - Responsive to container size

### UI/UX Requirements

1. **Responsive Design**
   - Mobile: Stack left and right panels vertically
   - Tablet: Maintain side-by-side with adjusted ratios
   - Desktop: Full layout as specified

2. **Loading States**
   - Show loading spinner while fetching tracks
   - Show loading spinner while fetching racers (after track selected)
   - Show loading spinner while fetching race data for graph

3. **Error Handling**
   - Display error message if API calls fail
   - Graceful handling of no data scenarios

4. **Styling Consistency**
   - Match existing design system (Tailwind classes)
   - Use same color palette (blue primary, gray neutrals)
   - Consistent spacing: p-4, p-6, mb-6, gap-4, etc.
   - Shadow: shadow-md, shadow-lg
   - Rounded corners: rounded-lg

---

## 🔧 TECHNICAL REQUIREMENTS

### Dependencies to Install
```bash
cd frontend
npm install chart.js react-chartjs-2
```

### Backend API Requirements

**Check if these endpoints exist. If not, create them:**

1. **GET /api/races/tracks** - Get all unique tracks/locations
   - Response: `{ success: true, data: ["K1 Speed Anaheim - T1", "K1 Speed Irvine - T2"] }`

2. **GET /api/races?location=X&racerName=Y** - Already exists, use with filters

3. **GET /api/racers?track=X** - Get racers who raced at specific track
   - If doesn't exist, filter client-side

### Data Transformation
- Parse race dates for chart labels
- Sort races chronologically
- Extract best lap times for each race
- Identify the best time across all races (for highlighting)

---

## 📝 STEP-BY-STEP IMPLEMENTATION PHASES

### PHASE 1: Setup and Navigation (15 minutes)

**Tasks:**
1.1. Add "Tracks" link to Navigation component
```typescript
// File: frontend/components/Navigation.tsx
// Add to links array:
{ href: '/tracks', label: 'Tracks' }
```

1.2. Create the tracks page directory and file
```bash
mkdir -p frontend/app/tracks
touch frontend/app/tracks/page.tsx
```

1.3. Create basic page structure with Navigation
```typescript
'use client';

import { Navigation } from '../../components/Navigation';

export default function TracksPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Performance Analysis</h1>
          {/* Content will go here */}
        </div>
      </main>
    </>
  );
}
```

**Validation:**
- ✅ Run `npm run dev` in frontend directory
- ✅ Navigate to http://localhost:3000/tracks
- ✅ Verify "Tracks" link appears in navigation
- ✅ Verify clicking link navigates to tracks page
- ✅ Verify page title displays correctly

---

### PHASE 2: Backend API Enhancements (20 minutes)

**Tasks:**
2.1. Check if `/api/races/tracks` endpoint exists
```bash
# Test from terminal
curl http://localhost:3001/api/races
curl http://localhost:3001/api/races/locations
```

2.2. If tracks endpoint doesn't exist, add it to backend

**File: `backend/src/controllers/races.controller.ts`**
```typescript
/**
 * GET /api/races/tracks - Get all unique track combinations (location + track)
 */
async getTracks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const races = await dataService.getAllRaces();
    const tracks = new Set<string>();
    
    races.forEach(race => {
      const trackId = `${race.raceInfo.location} - ${race.raceInfo.track}`;
      tracks.add(trackId);
    });
    
    res.json({
      success: true,
      data: Array.from(tracks).sort(),
    } as ApiResponse<string[]>);
  } catch (error) {
    next(error);
  }
}
```

**File: `backend/src/routes/races.routes.ts`**
```typescript
// Add this route BEFORE the /:id route
router.get('/tracks', (req, res, next) => racesController.getTracks(req, res, next));
```

**Validation:**
- ✅ Restart backend server
- ✅ Test endpoint: `curl http://localhost:3001/api/races/tracks`
- ✅ Verify returns array of track strings
- ✅ No TypeScript compilation errors

---

### PHASE 3: Frontend API Client Updates (10 minutes)

**Tasks:**
3.1. Add tracks API call to frontend API client

**File: `frontend/lib/api.ts`**
```typescript
// Add to racesApi object:
getTracks: async (): Promise<ApiResponse<string[]>> => {
  const response = await api.get('/api/races/tracks');
  return response.data;
},
```

3.2. Create custom hook for tracks

**File: `frontend/hooks/useTracks.ts`** (NEW FILE)
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { racesApi } from '../lib/api';

export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: () => racesApi.getTracks(),
  });
}
```

**Validation:**
- ✅ No TypeScript errors
- ✅ Import hook in tracks page and test data fetching

---

### PHASE 4: Install Chart.js and Create Graph Component (25 minutes)

**Tasks:**
4.1. Install dependencies
```bash
cd frontend
npm install chart.js react-chartjs-2
```

4.2. Create the performance chart component

**File: `frontend/components/PerformanceChart.tsx`** (NEW FILE)
```typescript
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
import { format } from 'date-fns';

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

  const data = {
    labels: chartData.map(d => format(new Date(d.date), 'MMM dd, yyyy')),
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
```

**Validation:**
- ✅ No TypeScript errors
- ✅ Component compiles successfully

---

### PHASE 5: Create Racer Stats Card Component (15 minutes)

**Tasks:**
5.1. Create the left panel component

**File: `frontend/components/RacerStatsCard.tsx`** (NEW FILE)
```typescript
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
```

**Validation:**
- ✅ No TypeScript errors
- ✅ Component displays properly when given data

---

### PHASE 6: Build Main Tracks Page with Selectors (30 minutes)

**Tasks:**
6.1. Implement the complete tracks page

**File: `frontend/app/tracks/page.tsx`**
```typescript
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
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Track Performance Analysis
          </h1>

          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '600px' }}>
            {/* Left Panel - Stats Card (1/3 width) */}
            <div className="w-full lg:w-1/3">
              {showGraph ? (
                <RacerStatsCard
                  racerName={selectedRacer}
                  races={filteredRaces}
                  trackName={selectedTrack}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                    <p>Select a track and racer to view statistics</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section (2/3 width) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
              {/* Selectors Panel (10% height) */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Track Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Track
                    </label>
                    <select
                      value={selectedTrack}
                      onChange={handleTrackChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                    >
                      <option value="">Choose a track...</option>
                      {tracks.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Racer Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Racer
                    </label>
                    <select
                      value={selectedRacer}
                      onChange={handleRacerChange}
                      disabled={!selectedTrack}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none transition-colors ${
                        !selectedTrack
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">
                        {selectedTrack ? 'Choose a racer...' : 'Select track first'}
                      </option>
                      {availableRacers.map((racer) => (
                        <option key={racer} value={racer}>
                          {racer}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Graph Panel (90% height) */}
              <div className="bg-white rounded-lg shadow-md p-6 flex-1" style={{ minHeight: '500px' }}>
                {showGraph ? (
                  <PerformanceChart races={filteredRaces} racerName={selectedRacer} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
                      <p className="text-lg font-medium">No data to display</p>
                      <p className="mt-2">Please select a track and racer to view performance trends</p>
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
```

**Validation:**
- ✅ Page loads without errors
- ✅ Track selector is enabled and populated
- ✅ Racer selector is disabled initially (gray background, cursor not-allowed)
- ✅ After selecting track, racer selector becomes enabled
- ✅ Racer selector shows only racers who raced at selected track
- ✅ Placeholder text shows before selections made
- ✅ Graph renders after both selections made
- ✅ Stats card displays in left panel after selections made

---

### PHASE 7: Styling and UX Polish (15 minutes)

**Tasks:**
7.1. Verify responsive design
```
- Test on mobile (< 768px): Stack vertically
- Test on tablet (768px - 1024px): Side by side with adjusted widths
- Test on desktop (> 1024px): Full layout
```

7.2. Verify hover states
- Track selector: Border changes to blue on hover
- Racer selector (enabled): Border changes to blue on hover
- Racer selector (disabled): No hover effect, cursor not-allowed

7.3. Verify color consistency
- Blue primary: #3B82F6 (for bars, borders)
- Green: #10B981 (for best time highlight)
- Gray neutrals: #6B7280 (for text)
- White backgrounds with shadow-md

7.4. Add transitions
```typescript
// Ensure all interactive elements have transition-colors class
className="... transition-colors"
```

**Validation:**
- ✅ Test on different screen sizes
- ✅ All hover states work correctly
- ✅ Disabled state is visually distinct
- ✅ Smooth transitions on interactions

---

### PHASE 8: Final Integration Testing (20 minutes)

**Tasks:**
8.1. Test complete user flow
1. Navigate to /tracks page
2. Select a track from dropdown
3. Verify racer dropdown enables
4. Select a racer
5. Verify graph appears with data
6. Verify stats card shows correct information
7. Change track selection
8. Verify racer dropdown resets and data clears
9. Select new track and racer
10. Verify new data loads correctly

8.2. Test edge cases
- What happens if track has only 1 race?
- What happens if racer has only 1 race at track?
- What if API returns error?
- What if no tracks exist?
- What if selected track has no racers?

8.3. Test performance
- Does page load quickly?
- Does graph render smoothly?
- Are there any console errors or warnings?

8.4. Cross-browser testing
- Test in Chrome
- Test in Firefox
- Test in Safari (if available)

**Validation:**
- ✅ All user flows work end-to-end
- ✅ Edge cases handled gracefully
- ✅ No console errors
- ✅ Good performance (< 2 second load times)
- ✅ Works in all browsers

---

## ✅ FINAL VALIDATION CHECKLIST

### Functionality
- [ ] /tracks page accessible from navigation
- [ ] Track selector populated with all tracks
- [ ] Racer selector disabled until track selected
- [ ] Racer selector enables after track selection
- [ ] Racer selector shows only racers for selected track
- [ ] Graph displays after both selections made
- [ ] Graph shows correct data (dates on X, times on Y)
- [ ] Best time highlighted in green
- [ ] Stats card shows correct calculations
- [ ] Changing track resets racer and clears graph

### UI/UX
- [ ] Layout matches specification (1/3 left, 2/3 right)
- [ ] Selectors panel is ~10% of right section height
- [ ] Graph panel is ~90% of right section height
- [ ] Disabled selector has gray background
- [ ] Enabled selector has hover effects
- [ ] Placeholder text shown before selections
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Responsive on mobile/tablet/desktop

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Components are modular and reusable
- [ ] Code follows existing patterns in codebase
- [ ] Proper error handling throughout
- [ ] Comments explain complex logic

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Graph renders smoothly
- [ ] No unnecessary re-renders
- [ ] API calls are cached appropriately (React Query)

---

## 🐛 COMMON ISSUES AND SOLUTIONS

### Issue: Chart.js not rendering
**Solution**: Ensure Chart.js is registered correctly
```typescript
import { Chart as ChartJS, ... } from 'chart.js';
ChartJS.register(...);
```

### Issue: Racer selector not disabling
**Solution**: Check disabled prop syntax
```typescript
disabled={!selectedTrack}
```

### Issue: Graph shows wrong data
**Solution**: Verify filtering logic
```typescript
const [location, track] = selectedTrack.split(' - ');
// Make sure split matches format from backend
```

### Issue: Stats card calculations incorrect
**Solution**: Check parseFloat and array operations
```typescript
const times = racerResults.map(r => parseFloat(r!.bestTime));
// Ensure no NaN values
```

### Issue: Responsive layout broken
**Solution**: Check Tailwind breakpoints
```typescript
className="w-full lg:w-1/3" // Mobile full, desktop 1/3
```

---

## 📚 REFERENCE DOCUMENTATION

- Chart.js Docs: https://www.chartjs.org/docs/latest/
- react-chartjs-2: https://react-chartjs-2.js.org/
- Tailwind CSS: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest
- date-fns: https://date-fns.org/docs

---

## 🎯 SUCCESS CRITERIA

The implementation is successful when:
1. ✅ User can navigate to /tracks page
2. ✅ User can select a track
3. ✅ Racer selector becomes enabled after track selection
4. ✅ User can select a racer
5. ✅ Performance graph displays showing lap time progression
6. ✅ Stats card displays accurate racer statistics
7. ✅ Best time is highlighted in green on graph
8. ✅ All UI/UX requirements met (styling, responsiveness)
9. ✅ No errors in console
10. ✅ Code quality matches existing codebase standards

---

**REMEMBER**: Explore the existing codebase FIRST before starting implementation. Understand the patterns, reuse components, and maintain consistency with the existing design system!
