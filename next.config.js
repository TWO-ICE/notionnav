/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
  typescript: {
    // 在生产构建时忽略类型错误
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/tailwind-scrollbar-hide/ }
    ];
    return config;
  }
};

module.exports = nextConfig 