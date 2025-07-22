import { useState } from "react"
import { Icon20DocumentTextOutline } from "@vkontakte/icons"
import { Accordion, Footnote, FormItem, IconButton, Input, Link } from "@vkontakte/vkui"

export const Privacy = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [touched, setTouched] = useState(false)
  const isValidUrl = (url: string) => {
    if (url.includes(' ')) return false
    try {
      const u = new URL(url)
      // Должна быть точка в hostname
      if (!u.hostname.includes('.')) return false
      // Порт не разрешён
      if (u.port) return false
      // После последней точки минимум 2 символа
      const lastDot = u.hostname.lastIndexOf('.')
      if (lastDot === -1 || u.hostname.length - lastDot - 1 < 2) return false
      return true
    } catch {
      return false
    }
  }
  const error = touched && value && !isValidUrl(value) ? 'Введите корректную ссылку' : undefined
  return(
    <Accordion>
      <Accordion.Summary before={
        <IconButton>
          <Icon20DocumentTextOutline/>
        </IconButton>
      }>
        Политика конфиденциальности
      </Accordion.Summary>

      <Accordion.Content>
        <FormItem>
          <Footnote style={{ color: 'var(--vkui--color_text_secondary)' }}>
          Укажите ссылку на документ с пояснением, как вы будете обрабатывать полученные данные пользователя — политику конфиденциальности или соглашение об обработке персональных данных.
          </Footnote>
        </FormItem>

        <FormItem
          top='Ссылка на документ'
          status={error ? 'error' : undefined}
          bottom={error || (
            <>
              Если не указана, будет использоваться <Link target='_blank' href='https://bugs-everywhere.ru/typical-data-proccessing-agreement'>типовая политика конфиденциальности</Link>.
            </>
          )}
        >
          <Input
            placeholder='https://example.com/privacy'
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
            status={error ? 'error' : undefined}
          />
        </FormItem>
      </Accordion.Content>
    </Accordion>
  )
}