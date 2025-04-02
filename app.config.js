export default {
  expo: {
    name: 'Istorio',
    slug: 'istorio',
    version: '1.0.0',
    owner: 'annaart',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.istorio',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      icon: {
        light: './assets/images/icon.png',
        dark: './assets/images/icon-dark.png',
        tinted: './assets/images/icon-tinted.png',
      }
    },
    android: {
      package: "com.istorio"
    },
    plugins: [
      'expo-router',
      'expo-localization'
    ],
    extra: {
      eas: {
        projectId: '3362b458-6c7d-4764-bb00-caab29f71301'
      }
    }
  }
};