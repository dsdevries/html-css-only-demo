import express from 'express';
import path from 'path';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';

const app = express();
const port = process.env.PORT || 3000;
const liveReloadPort = process.env.LIVERELOAD_PORT ? parseInt(process.env.LIVERELOAD_PORT, 10) : 35729;

const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from the 'dist' directory
const distPath = path.join(__dirname, '..', 'dist');

// LiveReload setup
if (!isProduction) {
    const liveReloadServer = livereload.createServer({
        port: liveReloadPort,
        extraExts: ['svg', 'webp'],
        delay: 100
    });
    liveReloadServer.watch(distPath);

    // Error handling for livereload to prevent crash on EADDRINUSE
    liveReloadServer.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log('LiveReload port already in use, skipping...');
        } else {
            console.error('LiveReload error:', err);
        }
    });

    app.use(connectLiveReload({
        port: liveReloadPort
    }));
}

// Serve static files from the 'dist' directory
app.use(express.static(distPath, { extensions: ['html'] }));

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
