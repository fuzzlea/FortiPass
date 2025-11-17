/**
 * Utility for accessing Electron APIs safely
 * This helps with type safety and provides fallbacks for web environments
 */

declare global {
    interface Window {
        electronAPI?: {
            getAppVersion(): Promise<string>;
            getAppPath(): Promise<string>;
        };
    }
}

export const useElectronAPI = () => {
    const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

    return {
        isElectron,
        electronAPI: isElectron ? window.electronAPI : null,
        getAppVersion: async () => {
            if (isElectron && window.electronAPI) {
                return await window.electronAPI.getAppVersion();
            }
            return 'development';
        },
        getAppPath: async () => {
            if (isElectron && window.electronAPI) {
                return await window.electronAPI.getAppPath();
            }
            return './';
        },
    };
};

export default useElectronAPI;
