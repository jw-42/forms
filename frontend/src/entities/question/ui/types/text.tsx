import { Icon16Done, Icon24CopyOutline } from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Avatar, Div, IconButton, Input, Snackbar } from "@vkontakte/vkui"

export interface TextQuestionProps {
  readOnly?: boolean
  value?: string
  onChange?: (value: string) => void
}

export const CopyButton = ({ value }: { value: string }) => {

  const router = useRouteNavigator()

  const handleCopyText = () => {
    bridge.send('VKWebAppCopyText', { text: value })

    router.showPopout(
      <Snackbar
        onClose={() => router.hidePopout()}
        duration={2000}
        before={
          <Avatar size={24} style={{ background: 'var(--vkui--color_background_accent)' }}>
            <Icon16Done fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Текст ответа скопирован
      </Snackbar>
    )
  }

  return(
    <IconButton onClick={handleCopyText}>
      <Icon24CopyOutline/>
    </IconButton>
  )
}

export const TextQuestion = ({ readOnly, value, onChange }: TextQuestionProps) => {
  return (
    <Div style={{ paddingTop: 0 }}>
      <Input
        readOnly={readOnly}
        placeholder='Напишите что-нибудь...'
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        after={(readOnly && value?.length) ? <CopyButton value={value} /> : undefined}
      />
    </Div>
  )
}