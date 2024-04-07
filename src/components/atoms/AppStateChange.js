import { useEffect } from 'react';
import { AppState } from 'react-native';
import { appStateConfig } from '../../constants/Enums';

export default function AppStateChange(action) {
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === appStateConfig.ACTIVE) {
                action && action(true)
            } else {
                action && action(false)
            }
        };

        // Subscribe to app state changes
        AppState.addEventListener(appStateConfig.CHANGE, handleAppStateChange);

        // Clean up the subscription when the component is unmounted
        return () => {
            AppState.removeEventListener(appStateConfig.CHANGE, handleAppStateChange);
        };
    }, []);
}