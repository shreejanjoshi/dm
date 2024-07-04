/** @type {import('next').NextConfig} */

// ------------------------------------------------------------
// ------------------------------------------------------------

const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   hostname: "localhost",
      //   pathname: "**",
      //   port: "3000",
      //   protocol: "http",
      // },

      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "dm-production-bded.up.railway.app",
      },
    ],
  },
};

// ------------------------------------------------------------
// ------------------------------------------------------------

module.exports = nextConfig;
