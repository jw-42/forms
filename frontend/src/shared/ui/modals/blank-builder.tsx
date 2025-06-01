import { BlankForm } from "@features/blank-form"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { ModalPage, ModalPageHeader, NavIdProps } from "@vkontakte/vkui"

export const BlankBuilderModal = (props: NavIdProps) => {

  const params = useParams<'id'>()
  const isNew = !params?.id

  return (
    <ModalPage
      header={<ModalPageHeader>{isNew ? 'Создание анкеты' : 'Редактирование анкеты'}</ModalPageHeader>}
      {...props}
    >
      <BlankForm />
    </ModalPage>
  )
}