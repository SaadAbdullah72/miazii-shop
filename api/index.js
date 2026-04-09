// Diagnostic wrapper: catches server initialization errors and shows them
let app;
try {
    const mod = await import('../server/server.js');
    app = mod.default;
} catch (e) {
    console.error('🔴 SERVER INIT ERROR:', e.message, e.stack);
    const express = (await import('express')).default;
    app = express();
    app.use((req, res) => {
        res.status(500).json({ 
            error: e.message, 
            stack: e.stack?.split('\n').slice(0, 5) 
        });
    });
}

export default app;
