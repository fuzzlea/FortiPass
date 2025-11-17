import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        fullscreen: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    // In development, load from Vite dev server
    // In production, load from built files
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    console.log('Loading URL:', startUrl);
    console.log('isDev:', isDev);
    mainWindow.loadURL(startUrl).catch((err) => {
        console.error('Failed to load URL:', err);
    });

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    // Always open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Log when page finished loading
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Page loaded successfully');
    });

    // Log console messages
    mainWindow.webContents.on('console-message', (level, message, line, sourceId) => {
        console.log(`[Console] ${message}`);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Example IPC handlers for secure communication between renderer and main process
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
    return app.getPath('userData');
});
