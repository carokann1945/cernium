import type { NextConfig } from 'next';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'g.nexonstatic.com',
      } as const,
      ...(cloudName
        ? [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
              pathname: `/${cloudName}/**`,
            } as const,
          ]
        : []),
    ],
  },
};

export default nextConfig;
