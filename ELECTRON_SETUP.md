# FortiPass Electron Setup Guide

## Overview

Your FortiPass project has been configured to work with Electron, allowing you to package it as a native application for Raspberry Pi and other platforms.

## Project Structure

```
FortiPass/
├── src/                    # React application source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── App.tsx
│   └── main.tsx
├── electron/             # Electron main process
│   ├── main.ts          # Main process entry point
│   └── preload.ts       # Preload script for IPC
├── dist/                # Built output (generated)
├── package.json         # Updated with Electron deps
├── vite.config.ts       # Vite config for web build
└── tsconfig.electron.json # TypeScript config for Electron
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Electron for desktop app framework
- Electron Builder for packaging
- Concurrently for running dev server + Electron together
- Wait-on for detecting when dev server is ready

### 2. Development Workflow

**Option A: Web Development (original workflow)**
```bash
npm run dev
```

**Option B: Electron Development** (recommended for testing native features)
```bash
npm run dev:electron
```

This starts both the Vite dev server and Electron app. Changes to React code will hot-reload.

### 3. Building for Production

**Build for Web:**
```bash
npm run build
```

**Build for Electron (creates distributable):**
```bash
npm run build:electron
```

This will:
1. Build React app to `dist/` folder
2. Bundle with Electron main/preload processes
3. Create platform-specific installers using electron-builder

## How It Works

### Architecture

1. **Electron Main Process** (`electron/main.ts`):
   - Runs on system startup capability
   - Creates and manages the application window
   - Handles native OS integration
   - Manages IPC communication with renderer

2. **Preload Script** (`electron/preload.ts`):
   - Secure bridge between renderer and main process
   - Exposes safe APIs to React app
   - Prevents direct access to Electron APIs

3. **React App** (`src/`):
   - Your existing React/Router code runs unchanged
   - Can access Electron APIs through `window.electronAPI`
   - Hot-reloads during development

### IPC Communication Example

In your React components, you can call Electron APIs:

```tsx
// Access Electron APIs from React
const version = await window.electronAPI.getAppVersion();
const appDataPath = await window.electronAPI.getAppPath();
```

To add more APIs, add handlers in `electron/main.ts` and expose them in `electron/preload.ts`.

## Deployment for Raspberry Pi

### Prerequisites
- Node.js installed on build machine
- Target Raspberry Pi running Linux

### Steps

1. **Cross-compile for ARM** (if building on different architecture):
   ```bash
   npm run build:electron -- --linux
   ```

2. **Install on Raspberry Pi**:
   - Copy the built `.deb` or AppImage to Pi
   - Install: `sudo apt install ./fortipass.deb`

3. **Auto-start on Boot**:
   Create a systemd service (`/etc/systemd/system/fortipass.service`):
   ```ini
   [Unit]
   Description=FortiPass
   After=network.target

   [Service]
   Type=simple
   User=pi
   ExecStart=/opt/FortiPass/fortipass
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

   Enable it:
   ```bash
   sudo systemctl enable fortipass
   sudo systemctl start fortipass
   ```

## Configuration

### Electron Builder Config

Edit the `build` section in `package.json` to customize:
- **appId**: Unique identifier for your app
- **productName**: Display name
- **files**: What gets bundled
- **linux/nsis**: Platform-specific settings
- **icon**: Application icon (create `assets/icon.png`)

### Window Size and Features

Edit `electron/main.ts` `createWindow()` function:
```ts
mainWindow = new BrowserWindow({
  width: 1024,
  height: 768,
  // Add more options:
  // fullscreen: true,
  // kiosk: true,  // For Raspberry Pi kiosk mode
});
```

## Adding More IPC APIs

**Step 1:** Add handler in `electron/main.ts`:
```ts
ipcMain.handle('my-custom-function', async () => {
  return 'Hello from main process';
});
```

**Step 2:** Expose in `electron/preload.ts`:
```ts
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  myCustomFunction: () => ipcRenderer.invoke('my-custom-function'),
});
```

**Step 3:** Use in React:
```tsx
const result = await window.electronAPI.myCustomFunction();
```

## Troubleshooting

**Dev server not connecting:**
- Wait 3-5 seconds for dev server to start
- Check `http://localhost:5173` is accessible

**Module not found errors:**
- Rebuild TypeScript: `npm run build`
- Clear node_modules: `rm -rf node_modules && npm install`

**Build issues:**
- Ensure Node.js version is 16+
- Check you have enough disk space
- Try `npm cache clean --force`

## Next Steps

1. Create `assets/icon.png` for your app icon (512x512 recommended)
2. Test `npm run dev:electron` workflow
3. Build and test on target Raspberry Pi
4. Customize window size/features for your needs
5. Add hardware-specific APIs (GPIO, etc.) as needed

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [IPC in Electron](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Raspberry Pi Deployment](https://www.electron.build/multi-platform-build)
