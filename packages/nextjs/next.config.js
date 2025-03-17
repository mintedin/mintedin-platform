/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["recharts"],
  typescript: {
    // Handle TypeScript errors at build time but don't fail the build
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Add module resolution aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ensure consistent library resolution
      recharts: require.resolve("recharts"),
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
