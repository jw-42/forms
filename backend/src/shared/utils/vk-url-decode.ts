/**
 * Decodes a string from PHP-style URL encoding (spaces as '+', etc.)
 * @param str Encoded string
 */
export function VKUrlDecode(str: string): string {
  const decoded = decodeURIComponent(
    str.replace(/\+/g, '%20')
  );
  console.log(`[VK-URL-DECODE] "${str}" -> "${decoded}"`);
  return decoded;
} 