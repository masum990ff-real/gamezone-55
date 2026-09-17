/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "https://TODO-NEW-BACKEND-URL",
  },
};
export default nextConfig;
