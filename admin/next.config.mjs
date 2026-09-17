/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "https://gamezone-55.onrender.com",
  },
};
export default nextConfig;
