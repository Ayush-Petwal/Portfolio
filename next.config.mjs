/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  sentry: {
    ignoreErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      console.log("Running on the server");
    } else {
      console.log("Running on the client");
    }
    return config;
  },
};

export default nextConfig;
