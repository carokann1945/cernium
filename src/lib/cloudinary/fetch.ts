const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function encodeRemoteUrl(url: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(url));
  } catch {
    return encodeURIComponent(url);
  }
}

export function toCloudinaryFetchUrl(src?: string | null) {
  if (!src) return null;
  if (!CLOUDINARY_CLOUD_NAME) return src;
  if (src.includes('res.cloudinary.com')) return src;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto/${encodeRemoteUrl(src)}`;
}
