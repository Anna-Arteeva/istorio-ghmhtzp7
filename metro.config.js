// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Increase the max workers and RAM limit
config.maxWorkers = 2;
config.transformer.minifierConfig = {
  compress: {
    reduce_funcs: false // Disable function reduction to save memory
  }
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false, // Disable inline requires to reduce memory usage
  },
});

// Increase the Metro server's heap size
if (process.env.NODE_OPTIONS === undefined) {
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
}

module.exports = config;