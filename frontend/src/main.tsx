import { createRoot } from 'react-dom/client'
import { AppConfig } from '@app/app-config.tsx'
import '../styles.css'

createRoot(document.getElementById('root')!).render(<AppConfig />)

if (import.meta.env.MODE === 'development') {
  import('./eruda.ts')
}
