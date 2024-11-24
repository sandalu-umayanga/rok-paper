/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['rokmediabucket.s3.amazonaws.com','rokstudentimagebucket.s3.amazonaws.com', 'rokstaffimagebucket.s3.amazonaws.com',"via.placeholder.com"], // Add your S3 bucket domain here
      },
};

export default nextConfig;
