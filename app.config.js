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
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.istorio',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        light: './assets/images/icon.png',
        dark: './assets/images/icon-dark.png',
        tinted: './assets/images/icon-tinted.png',
      },
    },
    android: {
      package: 'com.istorio',
      adaptiveIcon: {
        foregroundImage: './assets/images/android-icon.png',
        backgroundColor: '#1A1B30',
        monochromeImage: './assets/images/android-monochrome.png',
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-localization',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#1A1B30',
          image: './assets/images/icon-splash.png',
          dark: {
            image: './assets/images/icon-splash.png',
            backgroundColor: '#1A1B30',
          },
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      supabase: {
        url: process.env.EXPO_PUBLIC_SUPABASE_URL,
        anonymousKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      },
      eas: {
        projectId: '3362b458-6c7d-4764-bb00-caab29f71301',
      },
    },
  },
};