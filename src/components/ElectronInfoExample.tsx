/**
 * Example: How to use Electron APIs in React components
 * 
 * This demonstrates the recommended pattern for calling Electron
 * features from your React application.
 */

import { useEffect, useState } from 'react';
import useElectronAPI from '@/lib/useElectronAPI';

export function ElectronInfoExample() {
    const electronAPI = useElectronAPI();
    const [appVersion, setAppVersion] = useState<string>('');
    const [appPath, setAppPath] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAppInfo = async () => {
            try {
                if (electronAPI.isElectron && electronAPI.electronAPI) {
                    const version = await electronAPI.electronAPI.getAppVersion();
                    const path = await electronAPI.electronAPI.getAppPath();

                    setAppVersion(version);
                    setAppPath(path);
                }
            } catch (error) {
                console.error('Failed to load app info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAppInfo();
    }, [electronAPI]);

    if (isLoading) {
        return <div>Loading app information...</div>;
    }

    if (!electronAPI.isElectron) {
        return <div>Running in browser mode (not Electron)</div>;
    }

    return (
        <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">Electron App Info</h3>
            <p>Version: {appVersion}</p>
            <p>App Path: {appPath}</p>
        </div>
    );
}

export default ElectronInfoExample;
