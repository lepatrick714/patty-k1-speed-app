"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const races_routes_1 = __importDefault(require("./routes/races.routes"));
const racers_routes_1 = __importDefault(require("./routes/racers.routes"));
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3001; // Changed from 443 to 3001 for dev
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/races', races_routes_1.default);
app.use('/api/racers', racers_routes_1.default);
// Root endpoint
app.get('/', (req, res) => {
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
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});
app.listen(PORT, () => {
    console.log(`🚀 K1 Speed API Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   API docs:     http://localhost:${PORT}/`);
});
exports.default = app;
