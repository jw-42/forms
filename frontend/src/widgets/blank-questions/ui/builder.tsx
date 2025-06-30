import { MODALS } from "@shared/model/routes/routes"
import { Icon20ArticlesOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, Placeholder } from "@vkontakte/vkui"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"

export const QuestionBuilder = () => {

  const router = useRouteNavigator()

  return (
    <Placeholder
      action={
        <ButtonGroup mode="horizontal">
          <Button
            size='m'
            mode='secondary'
            before={<Icon20ArticlesOutline />}
            onClick={() => router.showModal(MODALS.QUESTION_BUILDER)}
          >
            Текстовый
          </Button>
        </ButtonGroup>
      }
    >
      Нажмите, чтобы добавить новый вопрос
    </Placeholder>
  )
}