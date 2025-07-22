import { useState } from "react"
import { Icon20DocumentTextOutline } from "@vkontakte/icons"
import { Accordion, Footnote, FormItem, IconButton, Input, Link } from "@vkontakte/vkui"
import { isValidPrivacyUrl } from '@shared/lib'

export const Privacy = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [touched, setTouched] = useState(false)
  const error = touched && value && !isValidPrivacyUrl(value) ? 'Введите корректную ссылку' : undefined
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