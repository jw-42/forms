import { VKUrlDecode } from './vk-url-decode'

export function verifySignature(
  params: Record<string, unknown>,
  sigField: string = 'sig',
  secret: string
): boolean {
  const { [sigField]: sig, ...rest } = params
  const keys = Object.keys(rest).sort()
  let baseString = ''
  for (const key of keys) {
    const value = VKUrlDecode(String(rest[key]))
    baseString += key + '=' + value
  }
  baseString += secret
  const hash = new Bun.CryptoHasher('md5').update(baseString).digest('hex')
  return hash === sig
} 