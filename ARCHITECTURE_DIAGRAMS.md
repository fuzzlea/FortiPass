# Architecture Diagrams

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Raspberry Pi (or Desktop)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │          Electron Application Window            │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────────┐  │     │
│  │  │     React Application (Your Code)        │  │     │
│  │  │  - Components                            │  │     │
│  │  │  - Pages                                 │  │     │
│  │  │  - Router                                │  │     │
│  │  │  - State Management                      │  │     │
│  │  │                                          │  │     │
│  │  │  Can call: window.electronAPI.getAppV...  │  │     │
│  │  └──────────────────────────────────────────┘  │     │
│  │           ↑        IPC Channel        ↑        │     │
│  │           │      (Message Passing)   │        │     │
│  ├────────────────────────────────────────────────┤     │
│  │  Preload Script (Security Bridge)               │     │
│  │  - Exposes safe APIs                           │     │
│  │  - Prevents direct access                      │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────────┐  │     │
│  │  │  Electron Main Process (Node.js)         │  │     │
│  │  │  - Window Management                     │  │     │
│  │  │  - File System Access                    │  │     │
│  │  │  - IPC Handlers                          │  │     │
│  │  │  - System Integration                    │  │     │
│  │  │  - Hardware APIs (GPIO, etc.)            │  │     │
│  │  └──────────────────────────────────────────┘  │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Chromium (Rendering Engine)                            │
│  V8 (JavaScript Engine)                                 │
│  Node.js Runtime                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Development Workflow

```
┌─────────────────────────────────────────────────┐
│  You Edit React Code (src/components/)           │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │  Vite Dev Server           │
        │  (Hot Module Replacement)  │
        └────────────────────┬───────┘
                             │
                             ↓
         ┌───────────────────────────────────┐
         │  Electron Window Updates          │
         │  (Instantly shows changes)        │
         └───────────────────────────────────┘
                             │
                             ↓
         ┌───────────────────────────────────┐
         │  You See Results (No Restart!)    │
         └───────────────────────────────────┘
```

## Build & Distribution Flow

```
npm run build:electron
         │
         ├─→ npm run build  (React)
         │        │
         │        └→ Vite compiles src/ to dist/
         │
         └→ TypeScript Compiler (Electron)
                  │
                  └→ Compiles electron/ folder
                     
         Both outputs → electron-builder
                  │
                  ├→ Creates .deb package (Debian/Raspberry Pi)
                  ├→ Creates .AppImage (Linux portable)
                  ├→ Creates .exe (Windows)
                  ├→ Creates .dmg (macOS)
                  │
                  └→ Available in dist/

Deploy → Raspberry Pi
    │
    └→ sudo apt install FortiPass.deb
         │
         └→ App ready to use/auto-start
```

## IPC Communication Pattern

```
React Component (Renderer)
        │
        │ await window.electronAPI.myFunction()
        │
        ↓
Preload Script
        │
        │ ipcRenderer.invoke('my-function', args)
        │
        ↓
Electron Main Process
        │
        │ ipcMain.handle('my-function', handler)
        │
        ├→ Access file system
        ├→ Run system commands
        ├→ Hardware control
        └→ Return result
        │
        ↓
Preload Script
        │
        │ Return result
        │
        ↓
React Component
        │
        └→ Use result in component
```

## File & Folder Relationships

```
package.json
    │
    ├─→ "main": "electron/main.ts"
    │
    ├─→ "scripts": {
    │       "dev:electron": "Vite + Electron"
    │       "build:electron": "Build + Package"
    │   }
    │
    └─→ "build": { ... electron-builder config ... }

vite.config.ts
    │
    └─→ Compiles src/ → dist/index.html + assets

electron/main.ts
    │
    ├─→ Loads: file://dist/index.html (production)
    │        or http://localhost:5173 (dev)
    │
    └─→ Preload: electron/preload.ts

src/main.tsx
    │
    └─→ Mounts React to <div id="root">
         in index.html

src/components/
src/pages/
src/lib/
    │
    └─→ All compiled by Vite into dist/
```

## Development vs Production

```
┌──────────────────────────────────────────────────┐
│          npm run dev:electron                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Vite Dev Server                                 │
│  http://localhost:5173                           │
│           ↑                                       │
│           │ Hot Reload (Fast!)                   │
│           │                                       │
│  React Code Changes  ←─ You edit files           │
│           │                                       │
│           ↓                                       │
│  Browser Reflects Changes Instantly              │
│  (No page reload, state preserved)               │
│                                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│        npm run build:electron                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. Vite builds optimized dist/                  │
│  2. TypeScript compiles Electron code            │
│  3. electron-builder packages everything         │
│  4. Creates .deb/.AppImage/.exe                  │
│                                                  │
│  Result: Ready for distribution!                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

## State Flow

```
┌──────────────────────┐
│  Browser Storage     │
│  (useSessionStorage) │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│  React Component                         │
│  ├─ State (useState)                     │
│  ├─ Session Storage (useSessionStorage)  │
│  ├─ Electron APIs (useElectronAPI)       │
│  └─ Router (useNavigate)                 │
└──────────────────────────────────────────┘
           │
           ├─→ Updates UI
           │
           └─→ Calls Electron APIs
               (if needed)
                   │
                   ↓
           Electron Main Process
           ├─ File System
           ├─ Hardware
           └─ System APIs
                   │
                   └─→ Returns result
                       (back to React)
```

## Security Model

```
Untrusted: React Component
    │
    │ Only access: window.electronAPI.*
    │ (carefully exposed APIs)
    │
    ↓
Preload Script (Security Boundary)
    │
    │ Validates and filters requests
    │ Uses contextIsolation: true
    │
    ↓
Trusted: Electron Main Process
    │
    │ Has full system access
    │ Implements only needed APIs
    │
    └─→ Returns safe results only
         (back through Preload)
```

## Raspberry Pi Deployment

```
Development Machine (Your Laptop)
    │
    ├─→ npm run build:electron
    │
    └─→ Creates: dist/FortiPass-*.deb

Transfer to Raspberry Pi
    │
    ├─→ scp FortiPass-*.deb pi@192.168.1.100:~
    │
    └─→ Install: sudo apt install FortiPass-*.deb

Raspberry Pi
    │
    ├─→ /opt/FortiPass/fortipass (installed binary)
    │
    ├─→ systemd service (auto-start)
    │
    └─→ App runs on boot! 🎉
```

These diagrams show how everything connects together!
