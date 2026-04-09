import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Smart customizations for the Mobile WebView experience.
 * This handles native system integration like the back button and status bar.
 */
export const initializeMobileApp = async () => {
    try {
        // 1. Configure Status Bar to match Electro Premium Theme
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0f172a' }); // Deep Dark Slate (Electro Theme)

        // 2. Hide Splash Screen automatically after app loads
        await SplashScreen.hide();

        // 3. Handle Android Hardware Back Button
        App.addListener('backButton', async (data) => {
            if (window.location.pathname === '/') {
                // If on homepage, minimize the app instead of closing
                App.exitApp();
            } else {
                // Otherwise, go back in history
                window.history.back();
            }
        });

        console.log('📱 [Mobile] Native optimizations initialized successfully.');
    } catch (e) {
        console.warn('📱 [Mobile] Running in web mode - Native plugins skipped.');
    }
};
