import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.booktrack.app',
  appName: 'BookTrack',
  webDir: 'dist',

  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT',
      hidden: false
    }
  }
}

export default config