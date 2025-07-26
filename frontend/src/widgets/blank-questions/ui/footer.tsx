import { Button, Div, Footnote, Link, Spacing } from "@vkontakte/vkui"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { useSubmitAnswers } from "@entities/answer"
import { useForm } from "@entities/form/hooks"
import { useQuestions } from "@entities/question/hooks"
import React from "react"

interface QuestionFooterProps {
  currentAnswers: Record<string, string>
}

export const QuestionFooter = ({ currentAnswers }: QuestionFooterProps) => {

  const params = useParams<'id'>()

  const { data: form } = useForm(params?.id)
  const { data: questions } = useQuestions(params?.id)
  const { mutate: submitAnswers, isPending } = useSubmitAnswers()

  const [safeLink, setSafeLink] = React.useState<string>('')

  const handleSubmitAnswers = () => {
    if (!questions || Object.keys(currentAnswers).length === 0) return

    // Проверяем, что все обязательные вопросы имеют ответы
    const requiredQuestions = questions.filter(q => q.required)
    const missingRequiredAnswers = requiredQuestions.filter(q => {
      const answer = currentAnswers[q.id.toString()]
      return !answer || answer.trim() === ''
    })

    if (missingRequiredAnswers.length > 0) {
      // Здесь можно добавить уведомление пользователю о незаполненных обязательных вопросах
      console.error('Missing required answers:', missingRequiredAnswers)
      return
    }

    // Отправляем все ответы (включая пустые для необязательных вопросов)
    submitAnswers({
      formId: params?.id as string,
      data: {
        answers: Object.entries(currentAnswers).map(([questionId, value]) => ({
          question_id: Number(questionId),
          value: value || undefined // Отправляем undefined для пустых ответов
        }))
      }
    })
  }

  React.useEffect(() => {
    if (form?.privacy_policy) {
      const encodedUrl = encodeURIComponent(form.privacy_policy)
      const vkLink = `https://vk.com/away.php?to=${encodedUrl}`
      setSafeLink(vkLink)
    }
  }, [form?.privacy_policy])

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
            Нажимая на кнопку, вы принимаете условия <Link target='_blank' href='https://bugs-everywhere.ru/user-agreement'>пользовательского соглашения</Link> и <Link target='_blank' href={safeLink}>политику конфиденциальности</Link> лица, разместившего анкету.
          </Footnote>
        </Div>
      )}
    </React.Fragment>
  )
}