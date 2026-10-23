import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Strip every console.* call from production builds (development keeps them)
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  images: {
    // Resizes Supabase Storage images (see lib/supabaseImageLoader.ts)
    loaderFile: "./lib/supabaseImageLoader.ts",
    remotePatterns: [
      // YouTube thumbnails for the click-to-play video embeds
      { protocol: "https", hostname: "i.ytimg.com" },
      // Public files in the Supabase Storage "images" bucket
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
    ],
  },
};

export default nextConfig;
