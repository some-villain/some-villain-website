import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails for the click-to-play video embeds
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
