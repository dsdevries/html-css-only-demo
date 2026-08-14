import express from 'express';
import path from 'path';
import livereload from 'livereload';

const app = express();
const port = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from the 'dist' directory
const distPath = path.join(__dirname, '..', 'dist');

// LiveReload setup
if (!isProduction) {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(distPath);

    // Error handling for livereload to prevent crash on EADDRINUSE
    liveReloadServer.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log('LiveReload port already in use, skipping...');
        } else {
            console.error('LiveReload error:', err);
        }
    });
}

// Serve static files from the 'dist' directory
app.use(express.static(distPath, { extensions: ['html'] }));

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
