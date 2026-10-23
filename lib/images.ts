/** Helpers for images stored in the public Supabase Storage bucket "images". */

export const IMAGE_BUCKET = 'images';

/** Image formats the site displays (any letter case: .PNG, .Jpeg, ...). */
export const WEB_IMAGE = /\.(png|jpe?g|webp)$/i;

/** Public URL for a file in the bucket (path segments are encoded, e.g. "Zine 1"). */
export const imageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

/** Leading page number in a file name ("3 name.png", "3_name.jpg"); un-numbered files sort last. */
export const pageNumber = (path: string) => {
  const match = path.slice(path.lastIndexOf('/') + 1).match(/^(\d+)/);
  return match ? Number(match[1]) : Infinity;
};

/** Sort comparator: by leading page number, then alphabetically. */
export const byPage = (a: string, b: string) => pageNumber(a) - pageNumber(b) || a.localeCompare(b);

/** Zine number from a Storage folder name ("Zine4", "Zine 4"), or undefined for other folders. */
export const zineNumber = (folder: string) => folder.match(/^Zine\s*(\d+)$/i)?.[1];
