import { QuestionProps } from "@entities/question"
import { useCreateQuestion, useQuestion, useUpdateQuestion } from "@entities/question/hooks"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Button, Div, FormItem, FormLayoutGroup, Input, ModalPage, ModalPageHeader, NavIdProps, Select } from "@vkontakte/vkui"
import { useEffect, useState } from "react"

export const QuestionBuilder = (props: NavIdProps) => {

  const router = useRouteNavigator()

  const params = useParams<'id'|'qid'>()

  const {
    data: question,
    isPending: isQuestionPending,
  } = useQuestion(params?.id, params?.qid)

  const {
    mutate: createQuestion,
    isPending: isCreating,
  } = useCreateQuestion()

  const {
    mutate: updateQuestion,
    isPending: isUpdating,
  } = useUpdateQuestion()

  const [text, setText] = useState('')
  const [type, setType] = useState<QuestionProps['type']>('text')

  const isPending = isCreating || isUpdating || (isQuestionPending && !!params?.qid)

  const handleSubmit = () => {
    if (!text || !params?.id) return

    const data = { text, type }
    params?.qid
      ? updateQuestion({ formId: params?.id, questionId: params?.qid, data })
      : createQuestion({ formId: params?.id, data })

    router.hideModal()
  }

  useEffect(() => {
    if (question?.text && question.type) {
      setText(question.text)
      setType(question.type)
    }
  }, [ question ])

  return (
    <ModalPage
      header={
        <ModalPageHeader>
          {params?.qid ? 'Вопрос' : 'Новый вопрос'}
        </ModalPageHeader>
      }
      onOpen={() => {
        setText(question?.text || '')
        setType(question?.type || 'text')
      }}
      {...props}
    >
      <FormLayoutGroup>
        <FormItem top='Тип вопроса'>
          <Select
            name='type'
            value={type}
            onChange={(e) => setType(e.target.value as QuestionProps['type'])}
            options={[
              { label: 'Текстовый вопрос', value: 'text' },
            ]}
            disabled={isPending}
          />
        </FormItem>

        <FormItem top='Текст вопроса'>
          <Input
            name='text'
            value={text}
            placeholder='Введите текст вопроса'
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
          />
        </FormItem>

        <Div>
          <Button
            size='l'
            stretched
            onClick={handleSubmit}
            disabled={isPending}
          >
            Сохранить вопрос
          </Button>
        </Div>
      </FormLayoutGroup>
    </ModalPage>
  )
}