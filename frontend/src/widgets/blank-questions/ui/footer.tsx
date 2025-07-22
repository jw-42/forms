import { Button, Div, Footnote, Link, Spacing } from "@vkontakte/vkui"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { useSubmitAnswers } from "@entities/answer"
import { useForm } from "@entities/form/hooks"
import React from "react"

interface QuestionFooterProps {
  currentAnswers: Record<string, string>
}

export const QuestionFooter = ({ currentAnswers }: QuestionFooterProps) => {

  const params = useParams<'id'>()

  const { data: form } = useForm(params?.id)
  const { mutate: submitAnswers, isPending } = useSubmitAnswers()

  const handleSubmitAnswers = () => {
    if (Object.keys(currentAnswers).length === 0) return

    submitAnswers({
      formId: params?.id as string,
      data: {
        answers: Object.entries(currentAnswers).map(([questionId, value]) => ({
          question_id: Number(questionId),
          value
        }))
      }
    })
  }

  return (
    <React.Fragment>
      {form?.has_answer ? (
        <Div>
          <Footnote style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
            Вы уже ответили на эту анкету
          </Footnote>
        </Div>
      ) : (
        <Div>
          <Button 
            size='l'
            stretched
            mode='primary'
            onClick={handleSubmitAnswers}
            disabled={form?.has_answer}
            loading={isPending}
          >
            Отправить анкету
          </Button>

          <Spacing size={6} />

          <Footnote style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
            Нажимая на кнопку, вы принимаете условия <Link target='_blank' href='https://bugs-everywhere.ru/user-agreement'>пользовательского соглашения</Link> и <Link target='_blank' href='https://bugs-everywhere.ru/typical-data-proccessing-agreement'>политики конфиденциальности</Link> лица, разместившего анкету.
          </Footnote>
        </Div>
      )}
    </React.Fragment>
  )
}