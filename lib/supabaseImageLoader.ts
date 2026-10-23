import type { ImageLoaderProps } from 'next/image';

const PUBLIC_PATH = '/storage/v1/object/public/';
const TRANSFORM_PATH = '/storage/v1/render/image/public/';

/**
 * next/image loader. Supabase Storage files are resized by Supabase when
 * NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS=true (a paid Supabase feature);
 * otherwise by Next.js's built-in optimizer. Local files are served as-is.
 */
export default function supabaseImageLoader({ src, width, quality }: ImageLoaderProps) {
  const q = quality ?? 75;
  if (src.startsWith('/')) return src;
  if (process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS === 'true' && src.includes(PUBLIC_PATH)) {
    return `${src.replace(PUBLIC_PATH, TRANSFORM_PATH)}?width=${width}&quality=${q}`;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
