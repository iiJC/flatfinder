/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone" // switch to standalone for server-side features (e.g. MongoDB, APIs)
};

export default nextConfig;
