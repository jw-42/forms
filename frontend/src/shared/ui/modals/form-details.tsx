import { useForm } from "@entities/form"
import { useAutoUpdateTime } from "@shared/lib"
import { Icon24Incognito } from "@vkontakte/icons"
import bridge, { UserInfo } from "@vkontakte/vk-bridge"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Avatar, Cell, Group, Header, MiniInfoCell, ModalPage, ModalPageHeader, NavIdProps } from "@vkontakte/vkui"
import React from "react"

export const FormDetails = (props: NavIdProps) => {

  const params = useParams<'id'>()
  const { data: form } = useForm(params?.id)
  const createdAt = useAutoUpdateTime(form?.created_at || new Date(0))

  const [userInfo, setUserInfo] = React.useState<UserInfo|undefined>(undefined)

  React.useEffect(() => {
    bridge.send('VKWebAppGetUserInfo', { user_id: form?.owner_id })
      .then((data) => setUserInfo(data))
  }, [])
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
            extraSubtitle={form?.created_at && `Анкета создана ${createdAt}`}
          >
            {userInfo?.first_name} {userInfo?.last_name}
          </Cell>
      </Group>

      <Group header={
        <Header size='s'>Описание</Header>
      }>
        <MiniInfoCell textWrap='full'>
          {form?.description}
        </MiniInfoCell>
      </Group>
    </ModalPage>
  )
}