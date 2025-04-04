/* global module */

module.exports = {
  expo: {
    name: 'Istorio',
    slug: 'istorio',
    version: '1.0.0',
    owner: 'aaarteeva',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'istorio',
    userInterfaceStyle: 'light',
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.istorio',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: "com.istorio"
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-localization'
    ],
    extra: {
      eas: {
        projectId: 'e1d5867a-cc1c-4d08-b300-cb513ebfe472'
      }
    }
  }
};