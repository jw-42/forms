import { useForm } from "@entities/form"
import { formatDate } from "@shared/lib"
import { Icon24Incognito } from "@vkontakte/icons"
import bridge, { UserInfo } from "@vkontakte/vk-bridge"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Avatar, Cell, Div, Group, Header, ModalPage, ModalPageHeader, NavIdProps, Paragraph } from "@vkontakte/vkui"
import React from "react"

export const FormDetails = (props: NavIdProps) => {

  const params = useParams<'id'>()
  const { data: form } = useForm(params?.id)

  const [userInfo, setUserInfo] = React.useState<UserInfo|undefined>(undefined)

  React.useEffect(() => {
    if (form?.owner_id) {
      bridge.send('VKWebAppGetUserInfo', { user_id: form?.owner_id })
        .then((data) => setUserInfo(data))
    }
  }, [ form ])

  return (
    <ModalPage
      header={
        <ModalPageHeader>Подробная информация</ModalPageHeader>
      }
      {...props}
    >
      <Group header={
        <Header size='s'>Об авторе</Header>
      }>
        <Cell
          before={
            <Avatar
              size={48}
              fallbackIcon={<Icon24Incognito/>}
              src={userInfo?.photo_100}
            />
          }
          extraSubtitle={form?.created_at && `Анкета создана ${formatDate(form?.created_at)}`}
        >
          {
            userInfo?.first_name && userInfo?.last_name
              ? `${userInfo?.first_name} ${userInfo?.last_name}`
              : 'Анонимный пользователь'
          }
        </Cell>
      </Group>

      <Group header={
        <Header size='s'>Описание</Header>
      }>
        <Div style={{ paddingTop: 0 }}>
          <Paragraph 
            style={{ 
              color: 'var(--vkui--color_text_secondary)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {form?.description}
          </Paragraph>
        </Div>
      </Group>
    </ModalPage>
  )
}