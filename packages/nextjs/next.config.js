/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  poweredByHeader: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Explicitly enable SWC
    swcMinify: true,
    forceSwcTransforms: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Improve module resolution
    config.resolve.modules = ["node_modules", "."];
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

    // Add alias for @ path
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };

    // Reduce build size by excluding unnecessary packages from the server bundle
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "react-particles",
        "tsparticles",
      ];
    }

    return config;
  },
  transpilePackages: ["tsparticles", "tsparticles-engine"],
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
  // Better error handling during build
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
