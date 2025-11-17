# Quick Reference Guide

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install everything
npm install

# 2. Start developing (runs Vite + Electron)
npm run dev:electron

# 3. Make changes to src/ - they'll hot-reload
# Your React code hot-reloads automatically!

# 4. When ready to distribute
npm run build:electron
```

**That's it!** Your app is now packagable for Raspberry Pi.

---

## 📁 Where to Put Your Code

| Goal | Location | Example |
|------|----------|---------|
| React components | `src/components/` | Navbar, PinPad, etc. |
| Pages/routes | `src/pages/` | Login, Dashboard, Vault |
| Utilities | `src/lib/` | useElectronAPI, helpers |
| Styles | `src/index.css` | or inline with Tailwind |
| Assets | `assets/` | icon.png, images |

**Your React code doesn't change - it all works as-is!**

---

## 🔌 Using Electron APIs

### From React Components

```tsx
import useElectronAPI from '@/lib/useElectronAPI';

export function MyComponent() {
  const electronAPI = useElectronAPI();
  
  const handleClick = async () => {
    if (electronAPI.isElectron) {
      const version = await electronAPI.electronAPI?.getAppVersion();
      console.log('Version:', version);
    }
  };

  return <button onClick={handleClick}>Get Version</button>;
}
```

### Adding New APIs

**1. Add handler in `electron/main.ts`:**
```typescript
ipcMain.handle('my-function', async () => {
  return 'Hello from Electron!';
});
```

**2. Expose in `electron/preload.ts`:**
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  myFunction: () => ipcRenderer.invoke('my-function'),
});
```

**3. Use in React:**
```typescript
const result = await window.electronAPI.myFunction();
```

---

## 🏗️ Build & Deploy

```bash
# Development
npm run dev:electron          # Run with hot reload
npm run dev                   # Web-only development

# Production
npm run build:electron        # Build Electron app + installers
npm run build                 # Build just web app

# Testing
npm run lint                  # Check code quality
npm run preview               # Preview production build locally
```

---

## 📦 File Structure (What You Need to Know)

```
src/                          ← Your React code (unchanged!)
├── components/              ← React components
├── pages/                   ← Page components (routes)
├── lib/                     ← Utilities & hooks
│   └── useElectronAPI.ts   ← Use this in components
├── App.tsx                  ← Main app component
└── main.tsx                 ← React entry point

electron/                     ← Electron stuff
├── main.ts                  ← Add IPC handlers here
└── preload.ts               ← Expose APIs here

dist/                        ← Generated (your built app)
assets/                      ← Put icon.png here
package.json                 ← Update scripts/config here
```

---

## 🎯 Development Workflow

```
1. Write/edit React components in src/
           ↓
2. Changes auto-reload in Electron window
           ↓
3. Test features in Electron app
           ↓
4. Need native features? Add IPC handler to main.ts
           ↓
5. Expose in preload.ts
           ↓
6. Use in React components
           ↓
7. When satisfied: npm run build:electron
           ↓
8. Deploy to Raspberry Pi
```

---

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Blank screen | Clear cache: `rm -rf node_modules dist && npm install` |
| Dev server won't connect | Wait 3-5 seconds for Vite to start |
| Hot reload not working | Restart `npm run dev:electron` |
| Build fails | Check Node.js version: `node --version` (needs 16+) |
| Type errors | Run `npm run build` - check for TypeScript issues |
| Module not found | Check import paths, use `@/` alias for `src/` |

---

## 🌐 Environment Detection

```tsx
// Check if running in Electron
const isElectronApp = typeof window !== 'undefined' && !!window.electronAPI;

// Or use the hook
const electronAPI = useElectronAPI();
if (electronAPI.isElectron) {
  // Running as Electron app
} else {
  // Running in browser
}
```

This lets your app work both in browser and as a native app!

---

## 📱 For Raspberry Pi

```bash
# Build for Pi
npm run build:electron

# Send .deb file to Pi
scp dist/FortiPass*.deb pi@192.168.1.100:~

# Install on Pi
ssh pi@192.168.1.100
sudo apt install ./FortiPass*.deb

# Auto-start on boot
# See RASPBERRY_PI_CUSTOMIZATION.md for systemd setup
```

---

## ✅ Your Existing Code

Everything you already have works:
- ✅ React components
- ✅ React Router navigation  
- ✅ Session storage
- ✅ Tailwind CSS
- ✅ All your custom components

**No changes needed to existing code!**

---

## 🚀 Next Steps

1. **`npm install`** - Install Electron
2. **`npm run dev:electron`** - Test it works
3. **`assets/icon.png`** - Add your app icon (512x512)
4. **Read `ELECTRON_SETUP.md`** - Full documentation
5. **`npm run build:electron`** - Build for distribution

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ELECTRON_SETUP.md` | Complete setup guide with examples |
| `ELECTRON_MIGRATION_SUMMARY.md` | What changed and why |
| `FILE_STRUCTURE_GUIDE.md` | Visual project layout |
| `RASPBERRY_PI_CUSTOMIZATION.md` | Pi-specific features |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment verification |

---

## 💡 Pro Tips

1. **Hot reload development** - `npm run dev:electron` is your friend
2. **Type safety** - Use TypeScript for Electron APIs
3. **Keep it simple** - Only expose what you need via IPC
4. **Test on Pi early** - Different hardware, different performance
5. **Use preload** - Never access Electron directly from React
6. **Version your builds** - Tag releases in git
7. **Log everything** - Helps debug on Pi later

---

## 🎓 Learn More

- [Electron Official Docs](https://www.electronjs.org/docs)
- [IPC Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Your ELECTRON_SETUP.md](./ELECTRON_SETUP.md)
- [Your RASPBERRY_PI_CUSTOMIZATION.md](./RASPBERRY_PI_CUSTOMIZATION.md)

---

## 🎉 You're Ready!

Your FortiPass app is now:
- ✅ Ready for Electron
- ✅ Ready for Raspberry Pi
- ✅ Ready for distribution
- ✅ Type-safe with TypeScript
- ✅ Easy to customize

**Start coding!** 🚀
