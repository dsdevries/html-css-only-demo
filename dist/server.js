"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const livereload_1 = __importDefault(require("livereload"));
const app = (0, express_1.default)();
const port = 3000;
// Serve static files from the 'src' directory for HTML and CSS
const srcPath = path_1.default.join(__dirname, '..', 'src');
const distPath = path_1.default.join(__dirname, '..', 'dist');
// LiveReload setup
const liveReloadServer = livereload_1.default.createServer();
liveReloadServer.watch([srcPath, distPath]);
// Error handling for livereload to prevent crash on EADDRINUSE
liveReloadServer.server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('LiveReload port already in use, skipping...');
    }
    else {
        console.error('LiveReload error:', err);
    }
});
// Serve static files from the 'dist' directory first (for compiled JS and bundled CSS)
app.use(express_1.default.static(distPath));
// Serve static files from the 'src' directory (for HTML)
app.use(express_1.default.static(srcPath));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
