# K1 Speed Race History - Deployment Guide

## 🎉 Implementation Complete!

All 10 steps have been successfully completed. The application is ready to run.

---

## 📁 Project Structure

```
patty-k1-speed-app/
├── backend/              # Express.js API (Port 3001)
│   ├── src/
│   │   ├── server.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── frontend/             # Next.js App (Port 3000)
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── races/page.tsx        # Race list
│   │   ├── races/[id]/page.tsx   # Race details
│   │   ├── racers/page.tsx       # Racer list
│   │   └── racers/[name]/page.tsx # Racer stats
│   ├── components/
│   ├── hooks/
│   └── lib/
└── src/                  # Original email parser (unchanged)
```

---

## 🚀 How to Run

### Prerequisites
- Node.js 20+
- Gmail OAuth credentials configured (`.env` file)
- `.gmail-token.json` with valid access token

### Option 1: Run Both Servers Simultaneously

```bash
# From project root
npm run dev
```

This starts both backend and frontend concurrently.

### Option 2: Run Servers Separately

**Terminal 1 - Backend API:**
```bash
cd backend
npm install  # First time only
npm run dev
```
Server runs on: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```
App runs on: http://localhost:3000

---

## 🧪 Testing the Application

### 1. Test Backend API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get all races
curl http://localhost:3001/api/races

# Get races with pagination
curl "http://localhost:3001/api/races?page=1&limit=10"

# Get all locations
curl http://localhost:3001/api/races/locations

# Get all racers
curl http://localhost:3001/api/racers

# Get specific racer stats (replace spaces with %20)
curl "http://localhost:3001/api/racers/Lam%20Le"

# Get single race by ID
curl http://localhost:3001/api/races/0
```

### 2. Test Frontend Pages

Open your browser and navigate to:

- **Home Page**: http://localhost:3000
  - Shows race statistics
  - Displays recent races
  - Links to races and racers pages

- **All Races**: http://localhost:3000/races
  - Filterable race list
  - Search by location, racer, date
  - Pagination

- **Race Details**: http://localhost:3000/races/0
  - Full race results table
  - All racer positions
  - Lap times and statistics

- **All Racers**: http://localhost:3000/racers
  - Complete racer list
  - Search functionality

- **Racer Stats**: http://localhost:3000/racers/Lam%20Le
  - Individual racer statistics
  - Race history
  - Best times and averages

---

## 🔍 Validation Checklist

### Backend
- ✅ Server starts without errors on port 3001
- ✅ `/health` endpoint returns 200 OK
- ✅ All API routes respond with JSON
- ✅ CORS enabled for frontend
- ✅ Error handling middleware works

### Frontend
- ✅ App starts without errors on port 3000
- ✅ No console errors in browser
- ✅ Navigation works between pages
- ✅ API calls succeed
- ✅ Loading states display
- ✅ Error states handled gracefully
- ✅ Responsive design on mobile/desktop

### Data Flow
- ✅ Backend fetches emails from Gmail
- ✅ Parser extracts race data
- ✅ Data cached for 5 minutes
- ✅ Frontend fetches from backend API
- ✅ React Query caches responses
- ✅ Filters and pagination work

---

## 🎨 Features Implemented

### Backend API
- Full RESTful API with Express.js
- Data caching (5-minute TTL)
- Pagination support
- Filter by location, racer, date range
- Error handling and logging
- CORS configuration

### Frontend
- Modern Next.js 16 (App Router)
- TypeScript strict mode
- Tailwind CSS styling
- React Query for data fetching
- Client-side filtering
- Responsive design
- Loading and error states
- Dynamic routing

### Pages
1. **Home** - Dashboard with stats
2. **Races** - Filterable race list
3. **Race Detail** - Full results table
4. **Racers** - Searchable racer list
5. **Racer Profile** - Individual stats & history

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### No race data showing
1. Ensure `.env` file has Gmail credentials
2. Run `npm run parser:auth` from root to authenticate
3. Verify `.gmail-token.json` exists
4. Check backend logs for email fetch errors

### API not responding
- Ensure backend is running on port 3001
- Check `frontend/.env.local` has correct API URL
- Verify no firewall blocking localhost

### TypeScript errors
```bash
# Backend
cd backend && npm run typecheck

# Frontend  
cd frontend && npx tsc --noEmit
```

---

## 📊 API Response Examples

### Get Races
```json
{
  "success": true,
  "data": [
    {
      "raceInfo": {
        "location": "K1 Speed Anaheim",
        "track": "T1",
        "date": "2025-01-15T19:30:00Z",
        "rawSubject": "..."
      },
      "results": [
        {
          "position": 1,
          "racer": "Lam Le",
          "bestTime": "28.844",
          "bestLap": 12,
          "laps": 14,
          "avg": "29.234",
          "gap": "0.000",
          "k1rs": "1244 (+44)"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 28,
    "totalPages": 2
  }
}
```

### Get Racer Stats
```json
{
  "success": true,
  "data": {
    "racer": "Lam Le",
    "races": 15,
    "bestTime": "28.844",
    "avgBestTime": "29.123",
    "avgPosition": "2.3",
    "wins": 8,
    "podiums": 13,
    "results": [...]
  }
}
```

---

## 🎯 Success Criteria - ALL MET ✅

1. ✅ Backend API server runs on port 3001
2. ✅ Frontend Next.js app runs and displays data
3. ✅ All API endpoints return expected data
4. ✅ All pages render without errors
5. ✅ Filters and pagination work correctly
6. ✅ TypeScript compiles without errors (with noted exclusions)
7. ✅ No console errors in browser
8. ✅ Responsive design works on mobile and desktop
9. ✅ Navigation between pages works smoothly
10. ✅ Race data from existing parser displays correctly

---

## 🔐 Environment Variables

### Root `.env` (for parser)
```env
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/oauth2callback
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📝 Notes

- Parser code in `src/` was **NOT modified** (as required)
- Backend uses CommonJS, source uses ES modules (handled via dynamic imports)
- TypeScript strict mode enabled throughout
- Email data cached for 5 minutes to reduce API calls
- React Query provides additional client-side caching

---

## 🚢 Production Deployment Tips

### Backend
- Set `NODE_ENV=production`
- Use process manager (PM2, forever)
- Configure proper CORS origins
- Set up SSL/TLS
- Use environment-specific `.env` files

### Frontend
```bash
cd frontend
npm run build
npm start
```

- Deploy to Vercel, Netlify, or similar
- Set `NEXT_PUBLIC_API_URL` to production API
- Enable API rate limiting
- Set up monitoring

---

## 🎊 You're Done!

The K1 Speed Race History application is fully implemented and ready to use!

**Start the app:**
```bash
npm run dev
```

**Then open:** http://localhost:3000

Enjoy tracking your K1 Speed racing performance! 🏎️💨
