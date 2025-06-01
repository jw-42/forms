import { useForm } from "@entities/form"
import { formatDate } from "@shared/lib"
import { Icon20ArticleOutline, Icon20ClockOutline } from "@vkontakte/icons"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Div, MiniInfoCell, ModalPage, ModalPageHeader, NavIdProps, Spacing } from "@vkontakte/vkui"

export const FormDetails = (props: NavIdProps) => {

  const params = useParams<'id'>()
  const { data: form } = useForm(params?.id)

  return (
    <ModalPage
      header={
        <ModalPageHeader>Подробная информация</ModalPageHeader>
      }
      {...props}
    >
      <Div>
        <MiniInfoCell textWrap='full' before={<Icon20ArticleOutline/>}>
          {form?.description}
        </MiniInfoCell>

        <Spacing size={2} />

        {form?.created_at && (
          <MiniInfoCell before={<Icon20ClockOutline/>}>
            Создана {formatDate(form.created_at)}
          </MiniInfoCell>
        )}
      </Div>
    </ModalPage>
  )
}