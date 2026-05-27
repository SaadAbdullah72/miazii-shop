import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miazishop.app',
  appName: 'miazi shop',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#fed700",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    }
  }
};

export default config;
