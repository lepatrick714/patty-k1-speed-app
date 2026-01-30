# AI Implementation Prompt: Tracks Page - Modern Color Scheme Update

## 🎯 OBJECTIVE
Update the `/tracks` page styling with a modern, minimalistic color scheme that improves visibility and aesthetics. The current design is too "hospital white" and the selectors are barely visible, with the disabled state being MORE visible than the active state (which is backwards).

---

## 🎨 NEW COLOR PALETTE (5-6 Colors)

### Primary Colors
- **Primary Blue**: `#2563EB` (Blue-600) - For buttons, active states, accents
- **Primary Blue Hover**: `#1D4ED8` (Blue-700) - For hover states
- **Success Green**: `#10B981` (Emerald-500) - For best times, positive metrics
- **Background Dark**: `#1F2937` (Gray-800) - For main background
- **Card Background**: `#374151` (Gray-700) - For card backgrounds
- **Text Primary**: `#F9FAFB` (Gray-50) - For primary text on dark backgrounds

### Accent/Neutral Colors
- **Text Secondary**: `#D1D5DB` (Gray-300) - For secondary text, labels
- **Border Color**: `#4B5563` (Gray-600) - For borders, dividers
- **Disabled State**: `#6B7280` (Gray-500) - For disabled elements
- **Input Background**: `#1F2937` (Gray-800) - For input/select backgrounds

---

## 🔧 SPECIFIC STYLING CHANGES

### 1. **Page Background**
```typescript
// Change from: bg-gray-50
// Change to: bg-gray-800

<main className="min-h-screen bg-gray-800">
```

### 2. **Page Title**
```typescript
// Change from: text-gray-900
// Change to: text-gray-50

<h1 className="text-3xl font-bold text-gray-50 mb-6">
```

### 3. **Left Panel - Stats Card**
**Current Issues**: Too white, hard to read
**Solution**: Dark card with colored accents

```typescript
// In RacerStatsCard.tsx
// Change card background and text colors:

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
```

### 4. **Placeholder State (Left Panel)**
```typescript
// Make placeholder more visible on dark background

<div className="bg-gray-700 rounded-lg shadow-xl p-6 h-full border border-gray-600 flex items-center justify-center">
  <div className="text-center text-gray-300">
    <svg
      className="mx-auto h-12 w-12 text-gray-500 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {/* ...svg path... */}
    </svg>
    <p className="text-gray-300">Select a track and racer to view statistics</p>
  </div>
</div>
```

### 5. **Selectors Panel** ⚠️ CRITICAL FIX
**Current Issue**: Active selector is nearly invisible, disabled selector is more visible (backwards!)
**Solution**: Make active state highly visible with strong borders and background

```typescript
// In tracks/page.tsx
<div className="bg-gray-700 rounded-lg shadow-xl p-6 border border-gray-600">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Track Selector - ACTIVE STATE */}
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

    {/* Racer Selector - DISABLED and ACTIVE STATES */}
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
```

### 6. **Graph Panel**
```typescript
// Make graph panel match dark theme

<div className="bg-gray-700 rounded-lg shadow-xl p-6 flex-1 border border-gray-600" style={{ minHeight: '500px' }}>
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
          {/* ...svg path... */}
        </svg>
        <p className="text-lg font-medium text-gray-50">No data to display</p>
        <p className="mt-2 text-gray-400">Please select a track and racer to view performance trends</p>
      </div>
    </div>
  )}
</div>
```

### 7. **Performance Chart Component**
```typescript
// In PerformanceChart.tsx
// Update chart options to match dark theme

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
      reverse: true,
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
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Update Main Page Container
- [ ] Change main background from `bg-gray-50` to `bg-gray-800`
- [ ] Update page title color from `text-gray-900` to `text-gray-50`

### Phase 2: Update RacerStatsCard Component
- [ ] Change card background from `bg-white` to `bg-gray-700`
- [ ] Add border: `border border-gray-600`
- [ ] Change shadow from `shadow-md` to `shadow-xl`
- [ ] Update all text colors:
  - Headings: `text-gray-50`
  - Labels: `text-gray-300`
  - Values: Keep colored (blue, green) but use -400 variants
  - Borders: `border-gray-600`

### Phase 3: Update Selectors Panel (CRITICAL)
- [ ] Change panel background from `bg-white` to `bg-gray-700`
- [ ] Add border: `border border-gray-600`
- [ ] Update shadow to `shadow-xl`
- [ ] **Active Select Styling**:
  - Background: `bg-gray-800`
  - Border: `border-2 border-blue-500` (thick, visible blue border)
  - Text: `text-gray-50`
  - Hover: `hover:border-blue-400`
  - Focus: `focus:ring-2 focus:ring-blue-400`
- [ ] **Disabled Select Styling**:
  - Background: `bg-gray-900` (darker than active)
  - Border: `border-2 border-gray-600` (subtle gray border)
  - Text: `text-gray-500`
  - Cursor: `cursor-not-allowed`
- [ ] Update label colors to `text-gray-300`

### Phase 4: Update Graph Panel
- [ ] Change panel background from `bg-white` to `bg-gray-700`
- [ ] Add border: `border border-gray-600`
- [ ] Change shadow to `shadow-xl`
- [ ] Update placeholder text colors to match dark theme

### Phase 5: Update PerformanceChart Component
- [ ] Update chart legend colors
- [ ] Update chart title color
- [ ] Update tooltip colors (background, text, border)
- [ ] Update axis label colors
- [ ] Update grid line colors
- [ ] Keep bar colors the same (blue #3B82F6, green #10B981)

### Phase 6: Update Placeholder States
- [ ] Update both placeholder SVG colors to `text-gray-500`
- [ ] Update placeholder text colors to `text-gray-300` and `text-gray-400`

---

## 🎯 KEY DESIGN PRINCIPLES

1. **Contrast First**: Active elements should be MORE visible than disabled ones
2. **Hierarchy**: Use color and size to create clear visual hierarchy
3. **Consistency**: Use the same colors for similar elements across the page
4. **Accessibility**: Ensure sufficient contrast ratios (WCAG AA minimum)
5. **Modern Dark Theme**: Dark backgrounds with light text, colored accents

---

## ✅ SUCCESS CRITERIA

The implementation is successful when:
1. ✅ Page has modern dark theme instead of "hospital white"
2. ✅ Active selector has BRIGHT BLUE border that's clearly visible
3. ✅ Disabled selector is LESS visible than active selector (darker, grayer)
4. ✅ Stats card is readable with good contrast on dark background
5. ✅ Chart text and grid lines are visible on dark background
6. ✅ Color palette uses only 5-6 colors consistently
7. ✅ Overall aesthetic is modern, clean, and minimalistic
8. ✅ All text is easily readable with proper contrast

---

## 🐛 CRITICAL FIXES

### Issue 1: Selector Visibility is Backwards
**Current Problem**: The disabled selector (gray background) is MORE visible than the active selector (white background).

**Solution**: 
- Active selector: Dark background with THICK BLUE BORDER (`border-2 border-blue-500`)
- Disabled selector: Even darker background with thin gray border (`border-2 border-gray-600`)

### Issue 2: Everything Blends Together
**Current Problem**: White backgrounds make everything blend into one mass.

**Solution**:
- Use `bg-gray-700` for cards/panels
- Use `bg-gray-800` for main background
- Add borders `border-gray-600` to separate sections

---

## 🎨 COLOR USAGE REFERENCE

| Element | Background | Border | Text | Accent |
|---------|------------|--------|------|--------|
| Main Page | `bg-gray-800` | - | `text-gray-50` | - |
| Cards/Panels | `bg-gray-700` | `border-gray-600` | `text-gray-50` | - |
| Active Select | `bg-gray-800` | `border-blue-500` | `text-gray-50` | Blue |
| Disabled Select | `bg-gray-900` | `border-gray-600` | `text-gray-500` | - |
| Labels | - | - | `text-gray-300` | - |
| Best Time | - | - | `text-emerald-400` | Green |
| Metric Values | - | - | `text-blue-400` | Blue |
| Grid Lines | - | `color: #4B5563` | - | - |

---

**REMEMBER**: The goal is to make the page look MODERN and SLEEK while ensuring active elements are HIGHLY VISIBLE and disabled elements are clearly de-emphasized!
