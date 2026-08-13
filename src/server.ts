import express from 'express';
import path from 'path';
import livereload from 'livereload';

const app = express();
const port = 3000;

// Serve static files from the 'src' directory for HTML and CSS
const srcPath = path.join(__dirname, '..', 'src');
const distPath = path.join(__dirname, '..', 'dist');

// LiveReload setup
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([srcPath, distPath]);

// Error handling for livereload to prevent crash on EADDRINUSE
liveReloadServer.server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('LiveReload port already in use, skipping...');
    } else {
        console.error('LiveReload error:', err);
    }
});

// Serve static files from the 'dist' directory first (for compiled JS and bundled CSS)
app.use(express.static(distPath));

// Serve static files from the 'src' directory (for HTML)
app.use(express.static(srcPath));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
