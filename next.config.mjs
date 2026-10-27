/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // yahoo-finance2 is a Node-only package; keep it out of the server bundle.
    serverComponentsExternalPackages: ["yahoo-finance2"],
  },
};

export default nextConfig;
