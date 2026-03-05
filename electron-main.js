const { app, BrowserWindow, shell, nativeTheme } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Force Dark Mode for the entire app (includes Google Auth popup)
nativeTheme.themeSource = 'dark';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;
let backendProcess;

const isDev = !app.isPackaged;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hidden', // Custom title bar feeling
        titleBarOverlay: {
            color: '#0f172a',
            symbolColor: '#ffffff',
            height: 30
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'frontend/public/vite.svg') // Update with actual icon path
    });

    // Load the app
    if (isDev) {
        const devUrl = 'http://localhost:5173';
        console.log(`Loading Dev URL: ${devUrl}`);
        mainWindow.loadURL(devUrl);
        // Open DevTools in dev mode
        mainWindow.webContents.openDevTools();
    } else {
        // Load production build
        mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
    }

    // Open external links in default browser
    // Handle new window requests (e.g., Google OAuth popups)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Allow Google Auth popups to open in a new window within the app
        if (url.includes('accounts.google.com') || url.includes('google.com')) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    autoHideMenuBar: true,
                    width: 600,
                    height: 700,
                    center: true,
                    alwaysOnTop: true,
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true
                    }
                }
            };
        }

        // Open other external links in default browser
        if (url.startsWith('https:')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });
}

function startBackend() {
    const serverPath = path.join(__dirname, 'backend', 'server.js');
    console.log(`Starting backend from: ${serverPath}`);

    backendProcess = spawn('node', [serverPath], {
        env: { ...process.env, PORT: 5000, MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hack-project' },
        stdio: 'inherit', // Pipe output to main console
        shell: true
    });

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend:', err);
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Kill backend on exit
app.on('will-quit', () => {
    if (backendProcess) {
        console.log('Killing backend process...');
        backendProcess.kill();
        // Windows might need explicit taskkill if spawn used shell: true
        // exec('taskkill /pid ' + backendProcess.pid + ' /T /F') 
    }
});
