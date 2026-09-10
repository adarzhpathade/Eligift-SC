import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eligify.app',
  appName: 'Eligify AI',
  webDir: 'public',
  server: {
    url: 'https://eligify-gamma.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FAFAF2',
      showSpinner: false,
      androidSplashResourceName: 'splash'
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FAFAF2',
    }
  }
};

export default config;
