export function isValidPrivacyUrl(url: string): boolean {
  if (!url) return true // пустая ссылка — ок
  if (url.includes(' ')) return false
  try {
    const u = new URL(url)
    if (!u.hostname.includes('.')) return false
    if (u.port) return false
    const lastDot = u.hostname.lastIndexOf('.')
    if (lastDot === -1 || u.hostname.length - lastDot - 1 < 2) return false
    return true
  } catch {
    return false
  }
} 