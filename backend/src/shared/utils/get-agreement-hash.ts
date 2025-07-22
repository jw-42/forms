const DEFAULT_URL = 'https://bugs-everywhere.ru/typical-data-processing-agreement'

export async function getAgreementHash(agreement_url?: string): Promise<{ url: string, hash: string }> {
  const url = agreement_url || DEFAULT_URL
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch agreement text')
  const text = await res.text()
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return { url, hash: hashHex }
}