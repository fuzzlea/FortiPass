# 📋 FortiPass Electron Setup Checklist

Copy this checklist and track your progress!

---

## ✅ Phase 1: Installation (5 minutes)

- [ ] Read `START_HERE.md` (opens in browser or VS Code)
- [ ] Run `npm install` in terminal
- [ ] Wait for dependencies to install
- [ ] Check for any error messages (should be none)

**Status:** ⏳ Waiting for you to run `npm install`

---

## ✅ Phase 2: Test Development (10 minutes)

- [ ] Run `npm run dev:electron`
- [ ] Wait for "VITE ready in" message
- [ ] Electron window opens with your app
- [ ] DevTools appear at bottom
- [ ] App shows your login page or dashboard

**Testing Steps:**
- [ ] Try clicking buttons in your app
- [ ] Test navigation with React Router
- [ ] Open `src/App.tsx` in editor
- [ ] Make a small change (e.g., change text)
- [ ] Watch change appear in Electron window (no refresh!)
- [ ] Verify hot reload is working

**Status:** ⏳ Waiting for you to run `npm run dev:electron`

---

## ✅ Phase 3: Understanding (20 minutes)

- [ ] Read `QUICK_REFERENCE.md` (3 min)
- [ ] Read `ARCHITECTURE_DIAGRAMS.md` (5 min)
- [ ] Understand these files:
  - [ ] `electron/main.ts` - Read and understand main process
  - [ ] `electron/preload.ts` - Read and understand IPC bridge
  - [ ] `src/lib/useElectronAPI.ts` - Read and understand React hook
- [ ] Understand the IPC pattern (Request → Main → Response)
- [ ] Know where to add custom Electron features

**Status:** ⏳ Read the documentation files listed above

---

## ✅ Phase 4: Asset Setup (5 minutes)

- [ ] Create `assets/` folder (if not exists)
- [ ] Create app icon: `assets/icon.png`
  - [ ] Size: 512x512 pixels
  - [ ] Format: PNG
  - [ ] Design: Your FortiPass logo/icon
- [ ] Icon will be used in installers and on taskbar

**Note:** Icon is optional but recommended for professional appearance.

**Status:** ⏳ Optional - Create icon or skip for now

---

## ✅ Phase 5: Build for Testing (5 minutes)

- [ ] Stop dev server (Ctrl+C)
- [ ] Run `npm run build:electron`
- [ ] Wait for build to complete
- [ ] Look for output in `dist/` folder
- [ ] Should see `.exe` (Windows), `.deb` (Linux), `.dmg` (macOS)
- [ ] Test installing on your machine (optional)

**Status:** ⏳ When ready - run `npm run build:electron`

---

## ✅ Phase 6: Raspberry Pi Prep (30 minutes)

- [ ] Read `RASPBERRY_PI_CUSTOMIZATION.md` thoroughly
- [ ] Decide on configuration:
  - [ ] Full screen? (fullscreen: true)
  - [ ] Kiosk mode? (kiosk: true)
  - [ ] Custom window size?
  - [ ] Hardware integration needed? (GPIO, etc.)
- [ ] Edit `electron/main.ts` if customization needed
- [ ] Plan your systemd service for auto-start

**Status:** ⏳ Plan Pi customizations

---

## ✅ Phase 7: Pi Configuration (If Needed)

If adding custom features:

- [ ] Add handler in `electron/main.ts`
  ```typescript
  ipcMain.handle('my-function', async () => {
    // Your code
  });
  ```
- [ ] Expose in `electron/preload.ts`
  ```typescript
  contextBridge.exposeInMainWorld('electronAPI', {
    myFunction: () => ipcRenderer.invoke('my-function'),
  });
  ```
- [ ] Use in React components
  ```typescript
  const result = await window.electronAPI.myFunction();
  ```
- [ ] Test with `npm run dev:electron`
- [ ] Verify in DevTools console

**Status:** ⏳ Optional - only if adding Electron features

---

## ✅ Phase 8: Build for Pi (5 minutes)

When ready to deploy to Raspberry Pi:

- [ ] Run `npm run build:electron -- --linux`
- [ ] Should create `.deb` file in `dist/`
- [ ] Transfer `.deb` to your Raspberry Pi

```bash
# Example (replace with your Pi's IP):
scp dist/FortiPass*.deb pi@192.168.1.100:~/
```

**Status:** ⏳ When ready to deploy

---

## ✅ Phase 9: Pi Installation (15 minutes)

On your Raspberry Pi:

- [ ] SSH into Pi: `ssh pi@192.168.1.100`
- [ ] Navigate to home: `cd ~`
- [ ] Install: `sudo apt install ./FortiPass*.deb`
- [ ] Wait for installation to complete
- [ ] Run manually: `fortipass` (test it works)
- [ ] Close app

**Status:** ⏳ When ready to install on Pi

---

## ✅ Phase 10: Auto-Start Setup (15 minutes)

To make app start automatically on Pi boot:

- [ ] Create service file:
  ```bash
  sudo nano /etc/systemd/system/fortipass.service
  ```

- [ ] Paste (see `RASPBERRY_PI_CUSTOMIZATION.md` for example):
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

  [Install]
  WantedBy=graphical.target
  ```

- [ ] Save (Ctrl+O, Enter, Ctrl+X)
- [ ] Enable service:
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable fortipass
  sudo systemctl start fortipass
  ```
- [ ] Verify it started: `systemctl status fortipass`
- [ ] Reboot and verify: `sudo reboot`
- [ ] App should appear after boot

**Status:** ⏳ When ready for auto-start

---

## ✅ Phase 11: Testing (30 minutes)

### On Your Machine
- [ ] Build: `npm run build:electron`
- [ ] Install the app
- [ ] Launch it from system apps
- [ ] Test all features
- [ ] Close and reopen app
- [ ] Verify state persistence (session storage)

### On Raspberry Pi
- [ ] After installation
- [ ] Launch app manually: `fortipass`
- [ ] Test all features
- [ ] Test performance on Pi hardware
- [ ] Close app
- [ ] After auto-start setup
- [ ] Reboot Pi
- [ ] Verify app launches automatically
- [ ] Check system performance
- [ ] Check logs if issues: `journalctl -u fortipass`

**Status:** ⏳ Verify everything works

---

## ✅ Phase 12: Final Verification (5 minutes)

Before calling it done:

- [ ] App runs on development machine
- [ ] App builds without errors: `npm run build:electron`
- [ ] App launches on Raspberry Pi
- [ ] All features work
- [ ] App persists state (session storage)
- [ ] Auto-start works after reboot (if enabled)
- [ ] App can be restarted without issues
- [ ] No console errors

**Status:** ⏳ Final checks complete

---

## 🎉 You're Done!

When all checkboxes are complete, you have:

✅ Electron-powered FortiPass app
✅ Running on development machine
✅ Running on Raspberry Pi
✅ Auto-starts on Pi boot
✅ All features tested
✅ Production-ready

---

## 📝 Notes Section

Use this space for notes during setup:

```
Installation Notes:
[Your notes here]

Development Notes:
[Your notes here]

Customization Notes:
[Your notes here]

Raspberry Pi Notes:
[Your notes here]

Issues Encountered:
[Your issues here]

Solutions Found:
[Your solutions here]
```

---

## 🆘 If You Get Stuck

| Issue | Solution | Docs |
|-------|----------|------|
| Dev server won't start | Wait 3-5 seconds | ELECTRON_SETUP.md |
| Blank window | Check console (F12) | ELECTRON_SETUP.md |
| Build fails | Check Node.js 16+ | ELECTRON_SETUP.md |
| Module errors | `npm install` again | QUICK_REFERENCE.md |
| Pi won't run app | Check install logs | RASPBERRY_PI_CUSTOMIZATION.md |
| Auto-start not working | Check systemd service | RASPBERRY_PI_CUSTOMIZATION.md |

---

## 📚 Documentation Reference

- `START_HERE.md` - Read first!
- `QUICK_REFERENCE.md` - Fast answers
- `ELECTRON_SETUP.md` - Setup guide
- `ARCHITECTURE_DIAGRAMS.md` - How it works
- `RASPBERRY_PI_CUSTOMIZATION.md` - Pi guide
- `DEPLOYMENT_CHECKLIST.md` - Before deploying

---

## ⏱️ Estimated Timeline

- Phase 1 (Install): 5 min
- Phase 2 (Test): 10 min
- Phase 3 (Understand): 20 min
- Phase 4 (Assets): 5 min
- Phase 5 (Build): 5 min
- Phase 6 (Pi Prep): 30 min
- Phase 7 (Customization): 30 min (optional)
- Phase 8 (Build for Pi): 5 min
- Phase 9 (Install on Pi): 15 min
- Phase 10 (Auto-start): 15 min
- Phase 11 (Testing): 30 min
- Phase 12 (Verification): 5 min

**Total: ~2-3 hours** (can vary based on customization)

---

## ✨ When Complete

You'll have:
- ✅ Your FortiPass app running in Electron
- ✅ Packaged as a native executable
- ✅ Running on Raspberry Pi
- ✅ Auto-starting on Pi boot
- ✅ Full filesystem access
- ✅ Ability to control hardware
- ✅ Production-ready deployment

**You did it!** 🎉

Now go build something awesome! 🚀
