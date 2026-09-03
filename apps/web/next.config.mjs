/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@restoqu/database', '@restoqu/types', '@restoqu/media'],
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless', 'ws', 'bcryptjs', '@prisma/client']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'bufferutil',
        'utf-8-validate',
        'ws',
        '@neondatabase/serverless'
      ];
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  }
};

export default nextConfig;
