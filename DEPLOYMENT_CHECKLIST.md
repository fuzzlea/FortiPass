# Electron Deployment Checklist

## Pre-Development Setup

- [ ] Read `ELECTRON_SETUP.md` completely
- [ ] Run `npm install` to install Electron and dependencies
- [ ] Test `npm run dev:electron` - verify both dev server and Electron start
- [ ] Check that your React app renders in Electron window
- [ ] Open DevTools (should open automatically in dev mode)

## Development Phase

- [ ] Test React hot reload - make a component change and verify it updates
- [ ] Test navigation - verify React Router works
- [ ] Test session storage - ensure `useSessionStorage` works
- [ ] Add custom Electron APIs as needed (if required)
- [ ] Create `assets/icon.png` (512x512 PNG recommended)
- [ ] Test all your app's features in Electron

## Building Phase

- [ ] Run `npm run build` - verify no build errors
- [ ] Check `dist/` folder is created with compiled files
- [ ] Verify `dist/index.html` exists and references bundled assets
- [ ] Run `npm run build:electron` - build with Electron Builder
- [ ] Verify installer/package is created in `dist/` folder

## Testing Phase - Desktop

- [ ] Install the built application on your development machine
- [ ] Test all features work
- [ ] Test the app launches correctly
- [ ] Close and reopen the app - verify it works
- [ ] Check app appears in system menus/taskbar properly

## Preparation for Raspberry Pi

- [ ] Update `package.json` build configuration if needed:
  - Adjust app dimensions for Pi display
  - Set fullscreen: true if needed
  - Enable kiosk mode if it's a dedicated device

- [ ] Create systemd service file for auto-start:
  ```bash
  /etc/systemd/system/fortipass.service
  ```

- [ ] Update your build command to target ARM:
  ```bash
  npm run build:electron -- --linux
  ```

## Deployment to Raspberry Pi

- [ ] Transfer `.deb` or `.AppImage` to Raspberry Pi
- [ ] Install: `sudo apt install ./fortipass*.deb`
- [ ] Test: Launch app manually from terminal or apps menu
- [ ] Install systemd service for auto-start
- [ ] Enable service: `sudo systemctl enable fortipass`
- [ ] Start service: `sudo systemctl start fortipass`
- [ ] Reboot and verify it auto-starts

## Post-Deployment

- [ ] Test all features work on Raspberry Pi
- [ ] Verify hardware interaction (GPIO, etc.) if applicable
- [ ] Check performance on Pi hardware
- [ ] Monitor app logs
- [ ] Document any Pi-specific customizations

## Optional Enhancements

- [ ] Add system tray icon
- [ ] Add keyboard shortcuts
- [ ] Implement auto-update functionality
- [ ] Add error reporting
- [ ] Create custom installers

## Troubleshooting Steps

If things don't work:

1. Clear caches:
   ```bash
   npm cache clean --force
   rm -rf node_modules dist
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 16+
   ```

3. Check development mode works:
   ```bash
   npm run dev:electron
   ```

4. Review logs in `~/.fortipass/` or system logs on Pi

5. Check ELECTRON_SETUP.md troubleshooting section

## Version Control

- [ ] Commit all changes to git
- [ ] Tag release version: `git tag -a v0.1.0 -m "Initial Electron release"`
- [ ] Create release notes documenting what was ported

## Documentation

- [ ] Update README.md with Electron information
- [ ] Document how to run development version
- [ ] Document how to build for distribution
- [ ] Document Raspberry Pi setup process
- [ ] Add any custom API documentation
