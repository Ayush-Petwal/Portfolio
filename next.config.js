const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  // ...existing code...
  exportTrailingSlash: true, // Ensure trailing slashes for static export
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // ...existing code...
    return {
      ...defaultPathMap,
      "/": { page: "/" },
      // Add other paths as needed
    };
  },
};

const sentryWebpackPluginOptions = {
  // ...existing code...
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
