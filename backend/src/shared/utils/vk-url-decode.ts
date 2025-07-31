/**
 * Decodes a string from PHP-style URL encoding (spaces as '+', etc.)
 * @param str Encoded string
 */
export function VKUrlDecode(str: string): string {
  return decodeURIComponent(
    str.replace(/\+/g, '%20')
  );
} 