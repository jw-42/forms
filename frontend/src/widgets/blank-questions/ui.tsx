import { Question } from "@entities/question"
import { Button, Separator } from "@vkontakte/vkui"
import { Footnote, Link, Spacing } from "@vkontakte/vkui"
import { Div } from "@vkontakte/vkui"
import React from "react"

export const BlankQuestions = () => {

  const questions: { type: 'text', text: string }[] = [
    {
      type: 'text',
      text: 'Здесь будет текст вопроса'
    },
    {
      type: 'text',
      text: 'Здесь будет текст вопроса'
    },
    {
      type: 'text',
      text: 'Здесь будет текст вопроса'
    },
  ]

  return (
    <React.Fragment>
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

      <Spacing>
        <Separator />
      </Spacing>

      <Div>
        <Button size='m' mode='primary' stretched>
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