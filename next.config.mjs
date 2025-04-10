/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone" // ✅ Use this for server-side features (e.g. MongoDB, APIs)
};

export default nextConfig;
