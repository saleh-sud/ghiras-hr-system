import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ghiras.hr',
  appName: 'ghiras-al-nahda-hr-system',
  webDir: 'dist',
  server: {
    androidScheme: 'https' // يمنع حظر الملفات المحلية في أندرويد
  }
};

export default config;