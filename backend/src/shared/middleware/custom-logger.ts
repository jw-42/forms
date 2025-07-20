import type { MiddlewareHandler } from 'hono'
import { getColorEnabledAsync } from 'hono/utils/color'

enum LogPrefix {
  Outgoing = '-->',
  Incoming = '<--',
  Error = 'xxx',
}

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.']
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter))
  return orderTimes.join(separator)
}

const time = (start: number) => {
  const delta = Date.now() - start
  return humanize([delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's'])
}

const getClientIP = (c: any) => {
  // Try different headers for IP address
  const headers = [
    'cf-connecting-ip', // Cloudflare
    'x-forwarded-for',  // Standard proxy header
    'x-real-ip',        // Nginx
    'x-client-ip',      // Apache
  ]
  
  for (const header of headers) {
    const ip = c.req.header(header)
    if (ip) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return ip.split(',')[0].trim()
    }
  }
  
  // Fallback to connection info if available
  if (c.req.raw?.cf?.connectingIP) {
    return c.req.raw.cf.connectingIP
  }
  
  return 'unknown'
}

const colorStatus = async (status: number) => {
  const colorEnabled = await getColorEnabledAsync()
  if (colorEnabled) {
    switch ((status / 100) | 0) {
      case 5: // red = error
        return `\x1b[31m${status}\x1b[0m`
      case 4: // yellow = warning
        return `\x1b[33m${status}\x1b[0m`
      case 3: // cyan = redirect
        return `\x1b[36m${status}\x1b[0m`
      case 2: // green = success
        return `\x1b[32m${status}\x1b[0m`
    }
  }
  return `${status}`
}

type PrintFunc = (str: string, ...rest: string[]) => void

async function log(
  fn: PrintFunc,
  prefix: string,
  method: string,
  path: string,
  status: number = 0,
  elapsed?: string,
  timestamp?: string,
  ip?: string
) {
  const timestampStr = timestamp ? `[${timestamp}]` : ''
  const ipStr = ip ? `[${ip}]` : ''
  
  const out =
    prefix === LogPrefix.Incoming
      ? `${timestampStr} ${ipStr} ${prefix} ${method} ${path}`
      : `${timestampStr} ${ipStr} ${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`
  fn(out)
}

export const customLogger = (fn: PrintFunc = console.log): MiddlewareHandler => {
  return async function logger(c, next) {
    const { method, url } = c.req
    const path = url.slice(url.indexOf('/', 8))
    const timestamp = new Date().toISOString()
    const ip = getClientIP(c)

    await log(fn, LogPrefix.Incoming, method, path, 0, undefined, timestamp, ip)

    const start = Date.now()

    await next()

    await log(fn, LogPrefix.Outgoing, method, path, c.res.status, time(start), timestamp, ip)
  }
} 