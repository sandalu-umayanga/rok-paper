/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'rokmediabucket.s3.amazonaws.com',
          },
          {
              protocol: 'https',
              hostname: 'rokstudentimagebucket.s3.amazonaws.com',
          },
          {
              protocol: 'https',
              hostname: 'rokstaffimagebucket.s3.amazonaws.com',
          },
          {
              protocol: 'https',
              hostname: 'via.placeholder.com',
          },
      ],
  },
};

export default nextConfig;
