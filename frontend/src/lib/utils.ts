export { cn } from "cn"

export function getImageUrl(path?: string | null) {
  if (!path) return null;
  // If it's already a full HTTP URL (like Unsplash mocks), return it directly
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If it's a relative MinIO path (e.g., /webbriks-uploads/...), prefix with MinIO base URL
  // Hardcoding default local MinIO for now, in prod you'd use env vars
  return `http://127.0.0.1:9000${path.startsWith('/') ? '' : '/'}${path}`;
}
