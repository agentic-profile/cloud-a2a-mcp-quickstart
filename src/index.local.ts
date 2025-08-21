import { app } from './router';

const PORT = process.env.PORT || 3000;

// Local HTTP server for development
// This starts an Express server directly (not wrapped in Lambda)
const server = app.listen(PORT, () => {
    console.log(`🚀 Local HTTP server started on port ${PORT}`);
    console.log(`📡 Server endpoint: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 JSON-RPC endpoint: http://localhost:${PORT}/`);
    console.log(`📋 Example curl: curl -X POST http://localhost:${PORT}/ -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{}}'`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}, shutting down local server...`);
    server.close(() => {
        console.log('✅ Local server stopped');
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
