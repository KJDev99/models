/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.basemodels.ru",
      },
    ],
  },
};

export default nextConfig;
