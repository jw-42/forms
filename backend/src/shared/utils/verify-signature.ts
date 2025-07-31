import { VKUrlDecode } from './vk-url-decode'

export function verifySignature(
  params: Record<string, unknown>,
  sigField: string = 'sig',
  secret: string
): boolean {
  const { [sigField]: sig, ...rest } = params
  const keys = Object.keys(rest).sort()
  
  console.log(`[VERIFY-SIGNATURE] Проверка подписи для параметров:`, JSON.stringify(params, null, 2))
  console.log(`[VERIFY-SIGNATURE] Извлеченная подпись:`, sig)
  console.log(`[VERIFY-SIGNATURE] Поля для подписи (отсортированные):`, keys)
  
  let baseString = ''
  for (const key of keys) {
    const value = VKUrlDecode(String(rest[key]))
    baseString += key + '=' + value
    console.log(`[VERIFY-SIGNATURE] ${key}=${value}`)
  }
  baseString += secret
  console.log(`[VERIFY-SIGNATURE] Базовая строка с секретом: ${baseString.substring(0, baseString.length - secret.length)}[SECRET]`)
  
  const hash = new Bun.CryptoHasher('md5').update(baseString).digest('hex')
  console.log(`[VERIFY-SIGNATURE] Вычисленный хеш: ${hash}`)
  console.log(`[VERIFY-SIGNATURE] Ожидаемая подпись: ${sig}`)
  console.log(`[VERIFY-SIGNATURE] Подписи совпадают: ${hash === sig}`)
  
  return hash === sig
} 