/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.notion.so', 'prod-files-secure.s3.us-west-2.amazonaws.com'],
  },
  // 禁用页面缓存
  staticPageGenerationTimeout: 1000,
  experimental: {
    workerThreads: true,
    cpus: 1
  }
}

module.exports = nextConfig 