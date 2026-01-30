# K1 Speed Race History Web Application - AI Implementation Guide

## 🎯 PROJECT OVERVIEW

This project extends an existing K1 Speed race results email parser into a full-stack web application that displays race history in an interactive web interface.

### Current State
- ✅ Node.js TypeScript email parser (`src/` directory)
- ✅ Google OAuth2 authentication for Gmail API
- ✅ Email parsing logic that extracts race results
- ✅ Type definitions for race data structures
- ✅ Sample output showing 28 parsed races with 160 unique racers

### Target State
Build a full-stack application with:
- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS
- **Backend**: Express.js REST API + TypeScript (port 443)
- **Features**: 
  - View race history
  - Filter by racer, location, date
  - Display racer statistics
  - Visualize performance trends

---

## 📋 TECHNOLOGY STACK

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (optional but recommended)
- **Data Fetching**: React Query / TanStack Query
- **Charts**: Recharts or Chart.js

### Backend
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Validation**: Zod or express-validator
- **CORS**: cors middleware
- **Rate Limiting**: express-rate-limit

### Shared
- **Data Types**: Shared TypeScript interfaces from `src/types.ts`
- **Date Handling**: date-fns or dayjs

---

## 🗂️ PROJECT STRUCTURE

```
patty-k1-speed-app/
├── src/                          # Existing parser code (DO NOT MODIFY)
│   ├── auth.ts
│   ├── fetchEmails.ts
│   ├── parseResults.ts
│   ├── types.ts
│   └── index.ts
├── backend/                      # NEW: Express API server
│   ├── src/
│   │   ├── server.ts            # Main Express server
│   │   ├── routes/
│   │   │   ├── races.routes.ts  # Race endpoints
│   │   │   └── racers.routes.ts # Racer endpoints
│   │   ├── controllers/
│   │   │   ├── races.controller.ts
│   │   │   └── racers.controller.ts
│   │   ├── services/
│   │   │   ├── data.service.ts  # Interface with parser
│   │   │   └── cache.service.ts # Simple in-memory cache
│   │   ├── middleware/
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── cors.middleware.ts
│   │   ├── types/
│   │   │   └── api.types.ts     # API-specific types
│   │   └── utils/
│   │       └── response.util.ts
│   ├── tsconfig.json
│   └── package.json
├── frontend/                     # NEW: Next.js application
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home/dashboard
│   │   ├── races/
│   │   │   └── page.tsx         # Race history list
│   │   ├── racers/
│   │   │   ├── page.tsx         # Racer list
│   │   │   └── [name]/
│   │   │       └── page.tsx     # Individual racer stats
│   │   └── api/                 # Optional API routes (proxy)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── RaceCard.tsx
│   │   ├── RaceTable.tsx
│   │   ├── RacerStatsCard.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── FilterBar.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── api.ts               # API client functions
│   │   └── types.ts             # Frontend types
│   ├── hooks/
│   │   └── useRaces.ts          # React Query hooks
│   ├── public/
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── shared/                       # NEW: Shared types and utilities
│   └── types/
│       └── index.ts             # Export from src/types.ts
└── package.json                  # Root workspace config
```

---

## 🚀 IMPLEMENTATION STEPS

### ⚠️ CRITICAL VALIDATION REQUIREMENTS

Before starting each step, validate:
1. ✅ Previous step completed successfully
2. ✅ All TypeScript compiles without errors (`tsc --noEmit`)
3. ✅ No linting errors
4. ✅ Required dependencies installed
5. ✅ Environment variables configured

After completing each step, validate:
1. ✅ Code compiles and builds successfully
2. ✅ Server/app starts without errors
3. ✅ API endpoints return expected responses (use Postman/curl)
4. ✅ UI renders without console errors

---

## 📝 STEP-BY-STEP IMPLEMENTATION

### STEP 1: Project Setup and Workspace Configuration
**Goal**: Set up monorepo structure with proper TypeScript configurations

#### Tasks:
1.1. Create root `package.json` with workspace configuration
```json
{
  "name": "k1-speed-app-workspace",
  "private": true,
  "workspaces": [
    "backend",
    "frontend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:backend\" \"npm:dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build"
  }
}
```

1.2. Create `shared/types/index.ts` that re-exports types from `src/types.ts`
```typescript
export * from '../../src/types';
```

1.3. Create `shared/package.json`
```json
{
  "name": "@k1-speed/shared",
  "version": "1.0.0",
  "main": "types/index.ts",
  "types": "types/index.ts"
}
```

**Validation**:
- ✅ Run `npm install` in root - should recognize workspaces
- ✅ Verify TypeScript can resolve shared types

---

### STEP 2: Backend API Server - Basic Setup
**Goal**: Create Express.js TypeScript server with basic structure

#### Tasks:
2.1. Initialize backend workspace
```bash
cd backend
npm init -y
npm install express cors dotenv
npm install -D typescript @types/express @types/cors @types/node tsx nodemon
```

2.2. Create `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

2.3. Create `backend/src/server.ts` with basic Express setup
```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app: Application = express();
const PORT = process.env.API_PORT || 443;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'K1 Speed Race History API', version: '1.0.0' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 K1 Speed API Server running on port ${PORT}`);
});

export default app;
```

2.4. Update `backend/package.json` scripts
```json
{
  "scripts": {
    "dev": "nodemon --watch 'src/**/*.ts' --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  }
}
```

**Validation**:
- ✅ Run `npm run typecheck` - should pass
- ✅ Run `npm run dev` - server starts on port 443
- ✅ Test `curl http://localhost:443/health` - returns JSON response
- ✅ Test `curl http://localhost:443/` - returns API info

---

### STEP 3: Backend - Data Service Layer
**Goal**: Create service to interface with existing parser code

#### Tasks:
3.1. Create `backend/src/services/data.service.ts`
```typescript
import { ParsedRaceEmail, RacerStats } from '@k1-speed/shared/types';
import { fetchAndParseRaces, getRacerStats } from '../../../src/index';

export class DataService {
  private cachedRaces: ParsedRaceEmail[] | null = null;
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all races (with caching)
   */
  async getAllRaces(forceRefresh = false): Promise<ParsedRaceEmail[]> {
    const now = new Date();
    const cacheExpired = !this.lastFetchTime || 
      (now.getTime() - this.lastFetchTime.getTime()) > this.CACHE_DURATION_MS;

    if (forceRefresh || !this.cachedRaces || cacheExpired) {
      console.log('Fetching races from email...');
      this.cachedRaces = await fetchAndParseRaces({ limit: 50 });
      this.lastFetchTime = now;
    }

    return this.cachedRaces || [];
  }

  /**
   * Get races filtered by criteria
   */
  async getRaces(filters: {
    location?: string;
    racerName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ParsedRaceEmail[]> {
    let races = await this.getAllRaces();

    if (filters.location) {
      races = races.filter(r => 
        r.raceInfo.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.racerName) {
      races = races.filter(r =>
        r.results.some(result => 
          result.racer.toLowerCase().includes(filters.racerName!.toLowerCase())
        )
      );
    }

    if (filters.startDate) {
      races = races.filter(r => r.raceInfo.date >= filters.startDate!);
    }

    if (filters.endDate) {
      races = races.filter(r => r.raceInfo.date <= filters.endDate!);
    }

    return races;
  }

  /**
   * Get single race by index or date
   */
  async getRaceById(id: string): Promise<ParsedRaceEmail | null> {
    const races = await this.getAllRaces();
    const index = parseInt(id, 10);
    
    if (!isNaN(index) && index >= 0 && index < races.length) {
      return races[index];
    }

    return null;
  }

  /**
   * Get unique locations
   */
  async getLocations(): Promise<string[]> {
    const races = await this.getAllRaces();
    const locations = new Set(races.map(r => r.raceInfo.location));
    return Array.from(locations).sort();
  }

  /**
   * Get all unique racers
   */
  async getAllRacers(): Promise<string[]> {
    const races = await this.getAllRaces();
    const racers = new Set<string>();
    
    races.forEach(race => {
      race.results.forEach(result => {
        racers.add(result.racer);
      });
    });

    return Array.from(racers).sort();
  }

  /**
   * Get stats for a specific racer
   */
  async getRacerStats(racerName: string): Promise<RacerStats | null> {
    const races = await this.getAllRaces();
    const stats = getRacerStats(races, racerName);
    
    if (stats.races === 0) {
      return null;
    }

    return stats;
  }

  /**
   * Clear cache (for manual refresh)
   */
  clearCache(): void {
    this.cachedRaces = null;
    this.lastFetchTime = null;
  }
}

export const dataService = new DataService();
```

**Validation**:
- ✅ TypeScript compiles without errors
- ✅ DataService can be instantiated
- ✅ Methods have proper type signatures

---

### STEP 4: Backend - API Routes and Controllers
**Goal**: Create RESTful API endpoints for races and racers

#### Tasks:
4.1. Create `backend/src/types/api.types.ts`
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RaceFilters {
  location?: string;
  racerName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
```

4.2. Create `backend/src/controllers/races.controller.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/data.service';
import { ApiResponse, PaginatedResponse, RaceFilters } from '../types/api.types';
import { ParsedRaceEmail } from '@k1-speed/shared/types';

export class RacesController {
  /**
   * GET /api/races - Get all races with optional filters
   */
  async getAllRaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: RaceFilters = {
        location: req.query.location as string,
        racerName: req.query.racerName as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };

      // Validate pagination
      if (filters.page! < 1) filters.page = 1;
      if (filters.limit! < 1 || filters.limit! > 100) filters.limit = 20;

      // Parse dates
      const filterOptions: any = {
        location: filters.location,
        racerName: filters.racerName,
      };

      if (filters.startDate) {
        filterOptions.startDate = new Date(filters.startDate);
      }
      if (filters.endDate) {
        filterOptions.endDate = new Date(filters.endDate);
      }

      const allRaces = await dataService.getRaces(filterOptions);
      
      // Pagination
      const total = allRaces.length;
      const totalPages = Math.ceil(total / filters.limit!);
      const start = (filters.page! - 1) * filters.limit!;
      const end = start + filters.limit!;
      const paginatedRaces = allRaces.slice(start, end);

      const response: PaginatedResponse<ParsedRaceEmail[]> = {
        success: true,
        data: paginatedRaces,
        pagination: {
          page: filters.page!,
          limit: filters.limit!,
          total,
          totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/races/:id - Get single race by ID
   */
  async getRaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const race = await dataService.getRaceById(id);

      if (!race) {
        res.status(404).json({
          success: false,
          error: 'Race not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: race,
      } as ApiResponse<ParsedRaceEmail>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/races/locations - Get all unique locations
   */
  async getLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await dataService.getLocations();
      res.json({
        success: true,
        data: locations,
      } as ApiResponse<string[]>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/races/refresh - Force refresh race data
   */
  async refreshRaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      dataService.clearCache();
      const races = await dataService.getAllRaces(true);
      
      res.json({
        success: true,
        message: `Refreshed ${races.length} races`,
        data: { count: races.length },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export const racesController = new RacesController();
```

4.3. Create `backend/src/controllers/racers.controller.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/data.service';
import { ApiResponse } from '../types/api.types';
import { RacerStats } from '@k1-speed/shared/types';

export class RacersController {
  /**
   * GET /api/racers - Get all racers
   */
  async getAllRacers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const racers = await dataService.getAllRacers();
      
      res.json({
        success: true,
        data: racers,
      } as ApiResponse<string[]>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/racers/:name - Get racer statistics
   */
  async getRacerStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.params;
      const stats = await dataService.getRacerStats(decodeURIComponent(name));

      if (!stats) {
        res.status(404).json({
          success: false,
          error: 'Racer not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: stats,
      } as ApiResponse<RacerStats>);
    } catch (error) {
      next(error);
    }
  }
}

export const racersController = new RacersController();
```

4.4. Create `backend/src/routes/races.routes.ts`
```typescript
import { Router } from 'express';
import { racesController } from '../controllers/races.controller';

const router = Router();

router.get('/', (req, res, next) => racesController.getAllRaces(req, res, next));
router.get('/locations', (req, res, next) => racesController.getLocations(req, res, next));
router.post('/refresh', (req, res, next) => racesController.refreshRaces(req, res, next));
router.get('/:id', (req, res, next) => racesController.getRaceById(req, res, next));

export default router;
```

4.5. Create `backend/src/routes/racers.routes.ts`
```typescript
import { Router } from 'express';
import { racersController } from '../controllers/racers.controller';

const router = Router();

router.get('/', (req, res, next) => racersController.getAllRacers(req, res, next));
router.get('/:name', (req, res, next) => racersController.getRacerStats(req, res, next));

export default router;
```

4.6. Update `backend/src/server.ts` to use routes
```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import racesRoutes from './routes/races.routes';
import racersRoutes from './routes/racers.routes';

dotenv.config({ path: '../.env' });

const app: Application = express();
const PORT = process.env.API_PORT || 443;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/races', racesRoutes);
app.use('/api/racers', racersRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'K1 Speed Race History API',
    version: '1.0.0',
    endpoints: {
      races: '/api/races',
      racers: '/api/racers',
      health: '/health',
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 K1 Speed API Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API docs:     http://localhost:${PORT}/`);
});

export default app;
```

**Validation**:
- ✅ Run `npm run typecheck` - no errors
- ✅ Start server: `npm run dev`
- ✅ Test endpoints with curl:
  ```bash
  curl http://localhost:443/api/races
  curl http://localhost:443/api/racers
  curl http://localhost:443/api/racers/Lam%20Le
  curl http://localhost:443/api/races/locations
  ```
- ✅ All endpoints return proper JSON responses

---

### STEP 5: Frontend - Next.js Setup
**Goal**: Initialize Next.js application with TypeScript and Tailwind

#### Tasks:
5.1. Create Next.js app
```bash
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
cd frontend
```

5.2. Install additional dependencies
```bash
npm install @tanstack/react-query axios date-fns
npm install -D @types/node
```

5.3. Create `frontend/lib/api.ts` - API client
```typescript
import axios from 'axios';
import type { ParsedRaceEmail, RacerStats } from '../../shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:443';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Race API calls
export const racesApi = {
  getAll: async (params?: {
    location?: string;
    racerName?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ParsedRaceEmail[]>> => {
    const response = await api.get('/api/races', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ParsedRaceEmail>> => {
    const response = await api.get(`/api/races/${id}`);
    return response.data;
  },

  getLocations: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/races/locations');
    return response.data;
  },

  refresh: async (): Promise<ApiResponse> => {
    const response = await api.post('/api/races/refresh');
    return response.data;
  },
};

// Racer API calls
export const racersApi = {
  getAll: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/racers');
    return response.data;
  },

  getStats: async (name: string): Promise<ApiResponse<RacerStats>> => {
    const response = await api.get(`/api/racers/${encodeURIComponent(name)}`);
    return response.data;
  },
};

export default api;
```

5.4. Create `frontend/lib/types.ts`
```typescript
export * from '../../shared/types';
```

5.5. Update `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:443
```

**Validation**:
- ✅ Next.js app builds: `npm run build`
- ✅ Next.js dev server starts: `npm run dev`
- ✅ Can access http://localhost:3000

---

### STEP 6: Frontend - React Query Setup and Custom Hooks
**Goal**: Set up data fetching with React Query

#### Tasks:
6.1. Create `frontend/app/providers.tsx`
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

6.2. Update `frontend/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'K1 Speed Race History',
  description: 'View your K1 Speed race history and statistics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

6.3. Create `frontend/hooks/useRaces.ts`
```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { racesApi } from '../lib/api';

export function useRaces(params?: {
  location?: string;
  racerName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['races', params],
    queryFn: () => racesApi.getAll(params),
  });
}

export function useRace(id: string) {
  return useQuery({
    queryKey: ['race', id],
    queryFn: () => racesApi.getById(id),
    enabled: !!id,
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => racesApi.getLocations(),
  });
}

export function useRefreshRaces() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => racesApi.refresh(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
  });
}
```

6.4. Create `frontend/hooks/useRacers.ts`
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { racersApi } from '../lib/api';

export function useRacers() {
  return useQuery({
    queryKey: ['racers'],
    queryFn: () => racersApi.getAll(),
  });
}

export function useRacerStats(name: string) {
  return useQuery({
    queryKey: ['racer', name],
    queryFn: () => racersApi.getStats(name),
    enabled: !!name,
  });
}
```

**Validation**:
- ✅ TypeScript compiles without errors
- ✅ App still runs with React Query provider

---

### STEP 7: Frontend - UI Components (Part 1: Basic Components)
**Goal**: Create reusable UI components

#### Tasks:
7.1. Create `frontend/components/Navigation.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/races', label: 'Races' },
    { href: '/racers', label: 'Racers' },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              🏎️ K1 Speed
            </Link>
            <div className="flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    pathname === link.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

7.2. Create `frontend/components/LoadingSpinner.tsx`
```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

7.3. Create `frontend/components/ErrorMessage.tsx`
```typescript
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
```

7.4. Create `frontend/components/FilterBar.tsx`
```typescript
'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: {
    location?: string;
    racerName?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  locations: string[];
}

export function FilterBar({ onFilterChange, locations }: FilterBarProps) {
  const [filters, setFilters] = useState({
    location: '',
    racerName: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      location: '',
      racerName: '',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Racer Name
          </label>
          <input
            type="text"
            value={filters.racerName}
            onChange={(e) => handleChange('racerName', e.target.value)}
            placeholder="Search racer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
```

**Validation**:
- ✅ Components render without errors
- ✅ TypeScript types are correct

---

### STEP 8: Frontend - UI Components (Part 2: Race Components)
**Goal**: Create race-specific UI components

#### Tasks:
8.1. Create `frontend/components/RaceCard.tsx`
```typescript
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
```

8.2. Create `frontend/components/RaceTable.tsx`
```typescript
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
```

**Validation**:
- ✅ Components compile without TypeScript errors
- ✅ Proper styling with Tailwind classes

---

### STEP 9: Frontend - Pages (Home, Races List, Racer Stats)
**Goal**: Create main application pages

#### Tasks:
9.1. Update `frontend/app/page.tsx` - Home/Dashboard
```typescript
'use client';

import { useRaces, useRacers } from '../hooks/useRaces';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import Link from 'next/link';

export default function HomePage() {
  const { data: racesData, isLoading: racesLoading, error: racesError } = useRaces({ limit: 5 });
  const { data: racersData } = useRacers();

  if (racesLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (racesError) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load race data" />
      </div>
    </>
  );

  const recentRaces = racesData?.data || [];
  const totalRacers = racersData?.data?.length || 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">🏎️ K1 Speed Race History</h1>
            <p className="text-xl mb-6">
              Track your performance, view race history, and compare with other racers
            </p>
            <div className="flex gap-4">
              <Link
                href="/races"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View All Races
              </Link>
              <Link
                href="/racers"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Browse Racers
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Races</div>
              <div className="text-3xl font-bold text-gray-900">
                {racesData?.pagination?.total || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Racers</div>
              <div className="text-3xl font-bold text-gray-900">{totalRacers}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Recent Races</div>
              <div className="text-3xl font-bold text-gray-900">{recentRaces.length}</div>
            </div>
          </div>

          {/* Recent Races */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Races</h2>
              <Link href="/races" className="text-blue-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRaces.slice(0, 3).map((race, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {race.raceInfo.location}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(race.raceInfo.date).toLocaleDateString()}
                  </p>
                  <div className="text-sm text-gray-700">
                    <strong>Winner:</strong> {race.results[0]?.racer}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Best Time:</strong> {race.results[0]?.bestTime}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
```

9.2. Create `frontend/app/races/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRaces, useLocations } from '../../hooks/useRaces';
import { Navigation } from '../../components/Navigation';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { FilterBar } from '../../components/FilterBar';
import { RaceCard } from '../../components/RaceCard';

export default function RacesPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data: racesData, isLoading, error } = useRaces({ ...filters, page, limit: 12 });
  const { data: locationsData } = useLocations();

  if (isLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (error) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load races" />
      </div>
    </>
  );

  const races = racesData?.data || [];
  const pagination = racesData?.pagination;
  const locations = locationsData?.data || [];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Race History</h1>

          <FilterBar onFilterChange={setFilters} locations={locations} />

          {races.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No races found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {races.map((race, idx) => (
                  <RaceCard key={idx} race={race} raceId={idx} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
```

9.3. Create `frontend/app/racers/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRacers } from '../../hooks/useRacers';
import { Navigation } from '../../components/Navigation';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import Link from 'next/link';

export default function RacersPage() {
  const { data, isLoading, error } = useRacers();
  const [search, setSearch] = useState('');

  if (isLoading) return (
    <>
      <Navigation />
      <LoadingSpinner />
    </>
  );

  if (error) return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load racers" />
      </div>
    </>
  );

  const racers = data?.data || [];
  const filteredRacers = racers.filter(racer =>
    racer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Racers</h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search racers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
              {filteredRacers.map((racer, idx) => (
                <Link
                  key={idx}
                  href={`/racers/${encodeURIComponent(racer)}`}
                  className="bg-white p-4 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{racer}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRacers.length} of {racers.length} racers
          </div>
        </div>
      </main>
    </>
  );
}
```

9.4. Create `frontend/app/racers/[name]/page.tsx`
```typescript
'use client';

import { use } from 'react';
import { useRacerStats } from '../../../hooks/useRacers';
import { Navigation } from '../../../components/Navigation';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { format } from 'date-fns';
import Link from 'next/link';

export default function RacerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);
  const { data, isLoading, error } = useRacerStats(decodedName);

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
        <ErrorMessage message="Failed to load racer stats" />
      </div>
    </>
  );

  const stats = data.data;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/racers" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Back to all racers
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{stats.racer}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Total Races</div>
              <div className="text-3xl font-bold text-gray-900">{stats.races}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Best Time</div>
              <div className="text-3xl font-bold text-gray-900">{stats.bestTime}s</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Avg Position</div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgPosition}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-500 text-sm font-medium mb-2">Wins</div>
              <div className="text-3xl font-bold text-gray-900">{stats.wins || 0}</div>
            </div>
          </div>

          {/* Race History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-800 text-white">
              <h2 className="text-2xl font-bold">Race History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Best Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Laps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.results?.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(result.date), 'PP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${
                          result.position === 1 ? 'text-yellow-600' :
                          result.position === 2 ? 'text-gray-500' :
                          result.position === 3 ? 'text-amber-700' :
                          'text-gray-900'
                        }`}>
                          #{result.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {result.bestTime}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {result.laps}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
```

**Validation**:
- ✅ All pages render without errors
- ✅ Navigation works between pages
- ✅ Data loads from backend API
- ✅ Filters and search work correctly

---

### STEP 10: Final Integration and Testing
**Goal**: Connect everything and perform end-to-end testing

#### Tasks:
10.1. Update root `package.json` with workspace commands (if not done in Step 1)

10.2. Create `backend/.env` (copy from root `.env` if needed)

10.3. Test full flow:
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

10.4. Test all endpoints:
- ✅ Home page loads (http://localhost:3000)
- ✅ Races page shows all races with filters
- ✅ Individual race details display correctly
- ✅ Racers list shows all racers
- ✅ Individual racer stats display correctly
- ✅ Navigation between pages works
- ✅ Backend API responds to all endpoints

10.5. Browser console validation:
- ✅ No console errors
- ✅ No TypeScript errors
- ✅ API calls succeed
- ✅ React Query caching works

**Final Validation Checklist**:
- ✅ Backend server runs on port 443
- ✅ Frontend runs on port 3000
- ✅ All API endpoints return correct data
- ✅ All pages render correctly
- ✅ Filters and pagination work
- ✅ TypeScript compiles without errors in both frontend and backend
- ✅ Tailwind CSS styles apply correctly
- ✅ No runtime errors in browser console

---

## 🔒 VALIDATION CHECKLIST (Use Throughout)

### Before Starting Any Step:
- [ ] Previous step completed successfully
- [ ] No TypeScript compilation errors
- [ ] No linting errors
- [ ] Dependencies installed
- [ ] Environment variables configured

### After Completing Any Step:
- [ ] Code compiles: `npm run typecheck`
- [ ] Server/app starts without errors
- [ ] API endpoints tested (Postman/curl)
- [ ] UI renders without console errors
- [ ] Git commit made (optional but recommended)

---

## 🚨 COMMON ISSUES AND SOLUTIONS

### Issue: Port 443 requires admin privileges
**Solution**: Change backend port to 3001 or 8080 in development
```typescript
const PORT = process.env.API_PORT || 3001;
```
Update frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Issue: CORS errors
**Solution**: Ensure backend has proper CORS configuration:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

### Issue: Module resolution errors
**Solution**: Ensure `tsconfig.json` has correct paths and `moduleResolution: "node"`

### Issue: Cannot import from `@k1-speed/shared`
**Solution**: Use relative paths or configure TypeScript path aliases properly

---

## 📚 API ENDPOINTS REFERENCE

### Races
- `GET /api/races` - Get all races (with pagination and filters)
- `GET /api/races/:id` - Get single race
- `GET /api/races/locations` - Get all locations
- `POST /api/races/refresh` - Refresh race data

### Racers
- `GET /api/racers` - Get all racers
- `GET /api/racers/:name` - Get racer statistics

---

## 🎨 DESIGN NOTES

- Use Tailwind CSS utility classes
- Responsive design (mobile-first)
- Color scheme: Blue primary (#2563eb), Gray neutrals
- Font: Inter (from Next.js)
- Podium positions highlighted (gold, silver, bronze)

---

## 📦 DEPENDENCIES SUMMARY

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## ✅ SUCCESS CRITERIA

The implementation is complete when:
1. ✅ Backend API server runs on port 443 (or configured port)
2. ✅ Frontend Next.js app runs and displays data
3. ✅ All API endpoints return expected data
4. ✅ All pages render without errors
5. ✅ Filters and pagination work correctly
6. ✅ TypeScript compiles without errors
7. ✅ No console errors in browser
8. ✅ Responsive design works on mobile and desktop
9. ✅ Navigation between pages works smoothly
10. ✅ Race data from existing parser displays correctly

---

## 🎯 IMPLEMENTATION PRIORITY

Execute steps in this exact order:
1. Project Setup (Step 1) - CRITICAL
2. Backend Setup (Steps 2-4) - CRITICAL  
3. Frontend Setup (Steps 5-6) - CRITICAL
4. UI Components (Steps 7-8) - HIGH PRIORITY
5. Pages (Step 9) - HIGH PRIORITY
6. Integration & Testing (Step 10) - CRITICAL

---

## 📝 NOTES FOR AI IMPLEMENTATION

- **Do NOT modify existing parser code** in `src/` directory
- **Follow TypeScript strict mode** - no `any` types without good reason
- **Validate each step** before moving to the next
- **Test endpoints** as you build them
- **Keep components small** and focused
- **Use proper error handling** everywhere
- **Cache data appropriately** to reduce email fetches
- **Document any deviations** from this plan

---

**Good luck with the implementation! Follow the steps carefully and validate at each stage.** 🚀
