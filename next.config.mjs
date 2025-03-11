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
  experimental: {
    outputFileTracingExcludes: {
      '/page': ['/']
    }
  },
};

export default nextConfig;
