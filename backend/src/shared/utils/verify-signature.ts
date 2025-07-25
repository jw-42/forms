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
    baseString += key + '=' + VKUrlDecode(String(rest[key]))
  }
  baseString += secret
  const hash = new Bun.CryptoHasher('md5').update(baseString).digest('hex')
  return hash === sig
} 