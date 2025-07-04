import { Button, Div, Footnote, Link, Spacing } from "@vkontakte/vkui"
import React from "react"
import { useSubmitAnswers } from "@entities/answer/hooks"
import { QuestionProps } from "@entities/question/types"
import { AnswerProps } from "@entities/answer/types"
import { useForm } from "@entities/form/hooks"

interface QuestionFooterProps {
  formId?: string
  answers: Record<string, string>
  questions?: QuestionProps[]
}

export const QuestionFooter = ({ formId, answers, questions }: QuestionFooterProps) => {

  const { data: form } = useForm(formId)
  const submitAnswers = useSubmitAnswers()

  const handleSubmit = () => {
    if (!formId || !questions) return

    const answersData: AnswerProps[] = questions
      .filter(question => answers[question.id]?.trim())
      .map(question => ({
        question_id: question.id,
        value: answers[question.id]
      }))

    if (answersData.length === 0) return

    submitAnswers.mutate({
      formId,
      data: { answers: answersData }
    })
  }

  const handleDeleteAnswers = () => {}

  return (
    <React.Fragment>
      {form?.is_answered ? (
        <Button
          size='l'
          stretched
          mode='tertiary'
          appearance='negative'
          onClick={handleDeleteAnswers}
        >
          Удалить ответы
        </Button>
      ) : (
        (
          <Div>
            <Button 
              size='l'
              stretched
              mode='primary'
              onClick={handleSubmit}
              loading={submitAnswers.isPending}
              disabled={!formId || !questions || questions.length === 0}
            >
              Отправить анкету
            </Button>
  
            <Spacing size={4} />
  
            <Footnote style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
              Нажимая на кнопку, вы принимаете условия <Link href='https://dev.vk.com/ru/user-agreement'>пользовательского соглашения</Link> и <Link href='https://dev.vk.com/ru/privacy-policy'>политики конфиденциальности</Link>.
            </Footnote>
          </Div>
        )
      )}
    </React.Fragment>
  )
}