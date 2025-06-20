import { useForm } from "@entities/form"
import { useAutoUpdateTime } from "@shared/lib"
import { Icon24Incognito } from "@vkontakte/icons"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Avatar, Cell, Group, Header, MiniInfoCell, ModalPage, ModalPageHeader, NavIdProps } from "@vkontakte/vkui"

export const FormDetails = (props: NavIdProps) => {

  const params = useParams<'id'>()
  const { data: form } = useForm(params?.id)
  const createdAt = useAutoUpdateTime(form?.created_at || new Date(0))

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
              <Avatar size={48} fallbackIcon={<Icon24Incognito/>} />
            }
            extraSubtitle={form?.created_at && `Анкета создана ${createdAt}`}
          >
            Анонимный автор
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