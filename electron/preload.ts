// Use CommonJS require for preload script compatibility
const { contextBridge, ipcRenderer } = require('electron') as typeof import('electron');

// Expose API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
});
