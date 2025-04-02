module.exports = {
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
      buildNumber: '1'
    },
    android: {
      package: "com.istorio",
      versionCode: 1
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