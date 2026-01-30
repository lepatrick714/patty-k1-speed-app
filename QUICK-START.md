# Quick Start Commands

## 🚀 Start Everything
```bash
# From project root - starts both servers
npm run dev
```

## 🔧 Individual Commands

### Backend (Port 3001)
```bash
cd backend
npm run dev        # Start dev server
npm run build      # Build for production
npm run typecheck  # Check TypeScript
```

### Frontend (Port 3000)
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Run production build
```

### Original Parser
```bash
npm run parser:dev    # Run parser
npm run parser:auth   # Authenticate Gmail
npm run parser:fetch  # Fetch emails only
```

## 🧪 Quick Test
```bash
# Test backend
curl http://localhost:3001/health
curl http://localhost:3001/api/races

# Open frontend
open http://localhost:3000
```

## 📦 Install Dependencies
```bash
# Root (includes both workspaces)
npm install

# Or individually
cd backend && npm install
cd frontend && npm install
```

## 🗂️ Key Files
- `backend/src/server.ts` - API entry point
- `frontend/app/page.tsx` - Home page
- `frontend/lib/api.ts` - API client
- `src/index.ts` - Email parser (unchanged)

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/
