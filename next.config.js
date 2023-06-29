/* eslint-disable @typescript-eslint/no-var-requires */
const webpackConfig = (config) => {
  config.experiments.topLevelAwait = true;
  return config;
};

const spreadWhen = (condition, data) => {
  if (condition) return [data];
  return [];
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/testing",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...spreadWhen(process.env.NEXT_PUBLIC_API_MOCKING === "msw", {
            key: "Service-Worker-Allowed",
            value: "/",
          }),
        ],
      },
    ];
  },
  poweredByHeader: false,
  generateEtags: false,
  webpack: webpackConfig,
};

module.exports = nextConfig;
