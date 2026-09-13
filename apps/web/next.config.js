/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lifeterrain/ui"],
  images: { remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }, { protocol: "https", hostname: "images.unsplash.com" }] },
};
module.exports = nextConfig;
