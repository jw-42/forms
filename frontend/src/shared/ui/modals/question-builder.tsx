import { QuestionMultipleType, QuestionProps, useQuestion, QuestionMultipleTypeDict, useCreateQuestion, useUpdateQuestion, useGenerateQuestionDescription } from "@entities/question"
import { Icon20Cancel, Icon20ListBulletOutline, Icon20Stars } from "@vkontakte/icons"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Div, FormItem, FormLayoutGroup, ModalPage, ModalPageHeader, NavIdProps, Select, Input, IconButton, Button, ButtonGroup, Switch, Cell, Checkbox } from "@vkontakte/vkui"
import { routes } from "@shared/model"
import React from "react"

const isMultipleType = (type?: string): type is QuestionMultipleType => {
  if (!type) return false
  return type in QuestionMultipleTypeDict
}

export const QuestionBuilder = (props: NavIdProps) => {

  const router = useRouteNavigator()
  const params = useParams<'id'|'qid'|'type'>()

  const [text, setText] = React.useState<string>('')
  const [type, setType] = React.useState<QuestionProps['type']>(params?.type as QuestionProps['type'] || 'text')
  const [required, setRequired] = React.useState<boolean>(true)

  const { data: question } = useQuestion(params?.id, Number(params?.qid))

  const {
    mutate: createQuestion,
    isPending: isCreateQuestionPending
  } = useCreateQuestion()

  const {
    mutate: updateQuestion,
    isPending: isUpdateQuestionPending,
  } = useUpdateQuestion()

  const {
    mutate: generateDescription,
    isPending: isGeneratingDescription,
  } = useGenerateQuestionDescription()

  const handleSuccess = () => {
    router.hideModal()
  }

  const handleManageOptions = () => {
    router.push(routes.forms.blank.questions["options-builder"].path, {
      id: params?.id,
      qid: params?.qid
    })
  }

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.slice(0, 64))
  }

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as QuestionProps['type'])
  }

  const handleSubmit = () => {
    if (params?.id && params?.qid) {
      updateQuestion({
        formId: params.id,
        questionId: Number(params.qid),
        data: { text, required }
      }, {
        onSuccess: handleSuccess
      })
    } else if (params?.id) {
      createQuestion({
        formId: params.id,
        data: { text, type, required }
      }, {
        onSuccess: handleSuccess
      })
    }
  }

  const handleGenerateDescription = () => {
    if (!params?.id || text.length < 3) return

    generateDescription({
      formId: params.id,
      questionId: params?.qid ? Number(params.qid) : 0,
      data: {
        questionText: text,
        questionType: type
      }
    }, {
      onSuccess: (data) => {
        if (data.description) {
          setText(data.description)
        }
      }
    })
  }

  React.useEffect(() => {
    if (question) {
      setText(question.text)
      setType(question.type)
      setRequired(question.required ?? true)
    }
  }, [question])

  return (
    <ModalPage
      header={
        <ModalPageHeader>
          {question ? 'Редактирование вопроса' : 'Новый вопрос'}
        </ModalPageHeader>
      }
      onOpen={() => {
        setText(question?.text || '')
        setType(question?.type || (params?.type as QuestionProps['type']) || 'text')
        setRequired(question?.required ?? true)
      }}
      {...props}
    >
      <FormLayoutGroup>
        <FormItem top='Формат'>
          <Select
            options={[
              { value: 'text', label: 'Текст (строка)' },
              { value: 'long_text', label: 'Текст (абзац)' },
              { value: 'radio', label: 'Один из списка' }
            ]}
            placeholder='Выберите формат вопроса'
            onChange={handleChangeType}
            disabled={!!params?.qid}
            defaultValue={type}
            value={type}
          />
        </FormItem>

        <FormItem top={
          <FormItem.Top>
            <FormItem.TopLabel>Текст</FormItem.TopLabel>

            <FormItem.TopAside>
              <ButtonGroup gap="s" mode="horizontal">
                {text.length >= 3 && (
                  <Button
                    size="s"
                    mode="tertiary"
                    before={<Icon20Stars />}
                    onClick={handleGenerateDescription}
                    loading={isGeneratingDescription}
                    disabled={isGeneratingDescription}
                  >
                    Сгенерировать
                  </Button>
                )}
                <span>{text.length || 0} / 64</span>
              </ButtonGroup>
            </FormItem.TopAside>
          </FormItem.Top>
        }>
          <Input
            name='text'
            placeholder='Введите текст вопроса'
            onChange={handleChangeText}
            autoComplete='off'
            value={text}
            after={
              (text.length > 0) && (
                <IconButton onClick={() => setText('')}>
                  <Icon20Cancel color='var(--vkui--color_icon_secondary)' />
                </IconButton>
              )
            }
          />
        </FormItem>

        <Checkbox
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        >
          Обязательный вопрос
        </Checkbox>

        <Div>
          <ButtonGroup stretched mode='vertical' gap='s'>
            {isMultipleType(question?.type) && (
              <Button
                size='l'
                stretched
                mode='secondary'
                before={<Icon20ListBulletOutline/>}
                onClick={handleManageOptions}
              >
                Управлять вариантами ответов
              </Button>
            )}

            <Button
              size='l'
              stretched
              onClick={handleSubmit}
              loading={isCreateQuestionPending || isUpdateQuestionPending}
            >
              Сохранить
            </Button>
          </ButtonGroup>
        </Div>
      </FormLayoutGroup>
    </ModalPage>
  )
}