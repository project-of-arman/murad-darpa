import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jrgbp.edu.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'narayanganjpreparatoryschool.edu.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dinajpureducationboard.gov.bd',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'http',
        hostname: 'dinajpureducationboard.portal.gov.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dinajpureducationboard.portal.gov.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
