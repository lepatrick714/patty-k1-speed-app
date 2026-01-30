import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import racesRoutes from './routes/races.routes';
import racersRoutes from './routes/racers.routes';

dotenv.config({ path: '../.env' });

const app: Application = express();
const PORT = process.env.API_PORT || 3001; // Changed from 443 to 3001 for dev

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
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
