import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strip every console.* call from production builds (development keeps them)
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  images: {
    // Resizes Supabase Storage images (see lib/supabaseImageLoader.ts)
    loaderFile: "./lib/supabaseImageLoader.ts",
    remotePatterns: [
      // YouTube thumbnails for the click-to-play video embeds
      { protocol: "https", hostname: "i.ytimg.com" },
      // Public files in any Supabase project's Storage (independent of build-time env vars)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
