// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Optimize memory usage
config.maxWorkers = 2;
config.transformer.minifierConfig = {
  compress: {
    reduce_funcs: false, // Disable function reduction to save memory
    drop_console: true, // Remove console.log statements
    passes: 1, // Reduce number of optimization passes
  }
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false, // Disable inline requires to reduce memory usage
  },
});

// Use default cache configuration
config.cacheStores = undefined;

// Optimize source map generation
config.transformer.sourceMap = {
  segmentCount: 4, // Reduce segment count for faster builds
};

// Increase the Metro server's heap size
if (process.env.NODE_OPTIONS === undefined) {
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
}

module.exports = config;