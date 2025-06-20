import { Question } from "@entities/question"
import { useQuestions } from "@entities/question/hooks"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Button, ButtonGroup, Placeholder, Separator } from "@vkontakte/vkui"
import { Footnote, Link, Spacing } from "@vkontakte/vkui"
import { Div } from "@vkontakte/vkui"
import React from "react"
import { Icon20ArticlesOutline } from "@vkontakte/icons"
import { MODALS } from "@shared/model/routes/routes"

export const QuestionBuilder = () => {

  const router = useRouteNavigator()

  return (
    <Placeholder
      action={
        <ButtonGroup mode="horizontal">
          <Button
            size='m'
            mode='secondary'
            before={<Icon20ArticlesOutline/>}
            onClick={() => router.showModal(MODALS.QUESTION_BUILDER)}
          >
            Текстовый
          </Button>
        </ButtonGroup>
      }
    >
      Нажми, чтобы добавить новый вопрос
    </Placeholder>
  )
}

export const BlankQuestions = () => {

  const params = useParams<'id'>()
  const formId = params?.id

  const { data: questions } = useQuestions(formId)

  return (
    <React.Fragment>
      {(questions) && (
        <>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <Question {...question} />
    
              {(index !== questions.length - 1) && (
                <Spacing>
                  <Separator />
                </Spacing>
              )}
            </React.Fragment>
          ))}

          {(questions.length < 5) && (
            <>
              {(questions.length > 0) && (<Spacing>
                <Separator />
              </Spacing>)}

              <QuestionBuilder/>
            </>
          )}
        </>
      )}

      <Spacing>
        <Separator />
      </Spacing>

      <Div>
        <Button size='l' mode='primary' stretched>
          Отправить анкету
        </Button>

        <Spacing size={4} />

        <Footnote style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
          Нажимая на кнопку, вы принимаете условия <Link href='https://dev.vk.com/ru/user-agreement'>пользовательского соглашения</Link>.
        </Footnote>
      </Div>
    </React.Fragment>
  )
}