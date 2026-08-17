const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let serverProcess = null;
let isBuilding = false;
let pendingBuild = false;
let buildTimeout = null;

function runBuild() {
    try {
        console.log('[watch] Building project...');
        execSync('npm run build', { stdio: 'inherit' });
        console.log('[watch] Build complete.');
    } catch (err) {
        console.error('[watch] Build failed:', err.message);
    }
}

function startServer() {
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }

    serverProcess = spawn('node', ['dist/server.js'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
    });

    serverProcess.on('exit', (code, signal) => {
        if (signal !== 'SIGTERM' && signal !== 'SIGINT') {
            console.log(`[watch] Server exited with code ${code}`);
        }
    });
}

function handleFileChange(eventType, filename) {
    if (!filename) return;

    // Ignore dotfiles, temp files, etc.
    if (filename.startsWith('.') || filename.endsWith('~')) return;

    if (buildTimeout) {
        clearTimeout(buildTimeout);
    }

    buildTimeout = setTimeout(() => {
        const isServerChange = filename === 'server.ts' || filename.endsWith('/server.ts') || filename.endsWith('\\server.ts');

        runBuild();

        if (isServerChange) {
            console.log('[watch] Server code changed, restarting server...');
            startServer();
        }
    }, 100);
}

// 1. Initial build
runBuild();

// 2. Start server
startServer();

// 3. Watch src directory
const srcDir = path.join(__dirname, '..', 'src');
console.log(`[watch] Watching ${srcDir} for changes...`);

const watcher = fs.watch(srcDir, { recursive: true }, handleFileChange);

function cleanup() {
    console.log('\n[watch] Shutting down...');
    watcher.close();
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
