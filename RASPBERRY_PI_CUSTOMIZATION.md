# Common Customizations for Raspberry Pi

This guide covers customizations you'll likely need for running FortiPass on Raspberry Pi.

## 1. Kiosk Mode (Full-screen, No Controls)

Ideal if this is a dedicated physical vault device.

**Edit `electron/main.ts`:**

```typescript
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      contextIsolation: true,
    },
    // Add these for kiosk mode:
    fullscreen: true,
    kiosk: true,
    icon: path.join(__dirname, '../assets/icon.png'),
  });
  // ... rest of code
};
```

## 2. Custom Window Size for Pi Display

If using a specific display, adjust dimensions:

```typescript
mainWindow = new BrowserWindow({
  width: 800,      // Change to your display width
  height: 600,     // Change to your display height
  webPreferences: { ... },
});
```

Common Pi displays:
- 7" touchscreen: 800x480
- 10" touchscreen: 1280x800
- HDMI monitor: 1024x768 or 1920x1080

## 3. Auto-start on Raspberry Pi Boot

Create `/etc/systemd/system/fortipass.service`:

```ini
[Unit]
Description=FortiPass - Physical Password Vault
After=network.target
Wants=graphical.target

[Service]
Type=simple
User=pi
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/pi/.Xauthority"
ExecStart=/opt/FortiPass/fortipass
Restart=on-failure
RestartSec=5

[Install]
WantedBy=graphical.target
```

Then enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable fortipass
sudo systemctl start fortipass
```

## 4. Hardware Integration (GPIO)

For physical buttons, readers, etc.

**Add to `electron/main.ts`:**

```typescript
import { ipcMain } from 'electron';

// Example: GPIO control
ipcMain.handle('gpio-write', async (event, pin: number, value: number) => {
  // You'll need a GPIO library like 'onoff' or 'gpio'
  // npm install onoff
  const GPIO = require('onoff').GPIO;
  const pin = new GPIO(pin, 'out');
  await pin.write(value);
  pin.unexport();
  return true;
});
```

**Expose in `electron/preload.ts`:**

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  gpioWrite: (pin: number, value: number) => 
    ipcRenderer.invoke('gpio-write', pin, value),
});
```

## 5. Network/Connectivity Check

For displaying connection status:

**Add to `electron/main.ts`:**

```typescript
ipcMain.handle('check-network', async () => {
  const dns = require('dns').promises;
  try {
    await dns.resolve('google.com');
    return { online: true };
  } catch {
    return { online: false };
  }
});
```

## 6. File Storage (Pi Filesystem)

Store vault data securely on the Pi:

**Add to `electron/main.ts`:**

```typescript
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

ipcMain.handle('save-vault-data', async (event, data: object) => {
  const vaultDir = path.join(app.getPath('userData'), 'vault');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir, { recursive: true });
  }
  
  const filePath = path.join(vaultDir, 'data.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return { success: true, path: filePath };
});

ipcMain.handle('load-vault-data', async () => {
  const vaultDir = path.join(app.getPath('userData'), 'vault');
  const filePath = path.join(vaultDir, 'data.json');
  
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return null;
});
```

## 7. Logging to File

For debugging on the Pi:

**Add to `electron/main.ts`:**

```typescript
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const logFile = path.join(app.getPath('userData'), 'app.log');

ipcMain.handle('log-message', async (event, message: string) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logLine);
  return true;
});
```

## 8. Environment-specific Configuration

**Create `src/config.ts`:**

```typescript
export const CONFIG = {
  isDev: process.env.NODE_ENV === 'development',
  isKiosk: process.env.KIOSK_MODE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default CONFIG;
```

**Use in your components:**

```typescript
import CONFIG from '@/config';

if (CONFIG.isDev) {
  console.log('Development mode');
}
```

## 9. Disable Keyboard Shortcuts (Security)

For a kiosk device, disable standard shortcuts:

**Add to `electron/main.ts`:**

```typescript
import { Menu } from 'electron';

// Disable default menu
Menu.setApplicationMenu(null);

// Or create custom minimal menu
const template = [
  {
    label: 'FortiPass',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'Cmd+Q',
        click: () => app.quit(),
      },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

## 10. Performance Optimization for Pi

**Update `vite.config.ts`:**

```typescript
export default defineConfig({
  // ... existing config
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

## 11. Building for Raspberry Pi ARM

**Commands for cross-platform building:**

```bash
# Build for Raspberry Pi (Linux ARM)
npm run build:electron -- --linux --arm64

# Or for older Pi (32-bit)
npm run build:electron -- --linux --armv7l

# For x64 Linux servers
npm run build:electron -- --linux --x64
```

## 12. Testing Checklist for Pi

```bash
# 1. SSH into Pi
ssh pi@your-pi-ip

# 2. Check app logs
cat ~/.fortipass/app.log

# 3. Check service status
systemctl status fortipass

# 4. Check if running
ps aux | grep fortipass

# 5. Check memory usage
free -h
top

# 6. Check disk usage
df -h

# 7. Restart service if needed
sudo systemctl restart fortipass
```

## Example: Complete Custom Component Using Electron

```tsx
import { useState, useEffect } from 'react';
import useElectronAPI from '@/lib/useElectronAPI';

export function PiSystemInfo() {
  const electronAPI = useElectronAPI();
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    const checkNetwork = async () => {
      if (electronAPI.isElectron && electronAPI.electronAPI) {
        // Assume you added this handler
        try {
          // const status = await window.electronAPI.checkNetwork?.();
          // setIsOnline(status?.online ?? false);
        } catch (error) {
          console.error('Network check failed:', error);
        }
      }
    };
    
    checkNetwork();
    const interval = setInterval(checkNetwork, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [electronAPI]);
  
  return (
    <div className="p-4">
      <h3>System Status</h3>
      <p>Network: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
    </div>
  );
}
```

## Resources for Raspberry Pi Dev

- [Raspberry Pi OS Docs](https://www.raspberrypi.com/documentation/)
- [Systemd Documentation](https://www.freedesktop.org/software/systemd/man/)
- [onoff GPIO library](https://github.com/fivdi/onoff)
- [Electron IPC Patterns](https://www.electronjs.org/docs/tutorial/ipc)

## Need More Features?

Add IPC handlers for:
- Temperature monitoring
- Power management
- External sensors
- Network configuration
- System information
- And more!

Keep the pattern consistent:
1. Add handler in `electron/main.ts`
2. Expose in `electron/preload.ts`
3. Use in React via `window.electronAPI`
