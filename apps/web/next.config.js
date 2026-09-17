/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@lifeterrain/ui"],
  images: { remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }, { protocol: "https", hostname: "images.unsplash.com" }] },
};
module.exports = nextConfig;
