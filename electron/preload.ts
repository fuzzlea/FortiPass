import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
});

export type ElectronAPI = {
    getAppVersion: () => Promise<string>;
    getAppPath: () => Promise<string>;
};

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
