import { routes } from "@shared/model"
import { Icon20ArticlesOutline, Icon20TextOutline, Icon20ListBulletOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, Placeholder } from "@vkontakte/vkui"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"

export const QuestionBuilder = () => {

  const params = useParams<'id'>()

  const router = useRouteNavigator()

  return (
    <Placeholder
      action={
        <ButtonGroup mode="horizontal">
          <Button
            size='m'
            mode='secondary'
            before={<Icon20TextOutline />}
            onClick={() => router.push(routes.forms.blank.questions["question-creation"].path, {
              id: params?.id,
              type: 'text'
            })}
          >
            Строка
          </Button>

          <Button
            size='m'
            mode='secondary'
            before={<Icon20ArticlesOutline />}
            onClick={() => router.push(routes.forms.blank.questions["question-creation"].path, {
              id: params?.id,
              type: 'long_text'
            })}
          >
            Абзац
          </Button>

          <Button
            size='m'
            mode='secondary'
            before={<Icon20ListBulletOutline />}
            onClick={() => router.push(routes.forms.blank.questions["question-creation"].path, {
              id: params?.id,
              type: 'radio'
            })}
          >
            С вариантами
          </Button>
        </ButtonGroup>
      }
    >
      Нажмите, чтобы добавить новый вопрос
    </Placeholder>
  )
}