import { Button, ButtonGroup, Div, FormItem, FormLayoutGroup, Input, List, ModalPage, ModalPageHeader, NavIdProps, PanelHeaderBack, Select } from "@vkontakte/vkui"
import { Icon20RadioOff, Icon20ShuffleOutline, Icon20WriteOutline } from "@vkontakte/icons"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes } from "@shared/model"
import { Option, useCreateMultipleOptions } from "@entities/option"
import { QuestionMultipleTypeDict, useQuestion } from "@entities/question"
import React, { useState, useEffect, useCallback, useRef } from "react"

interface LocalOption {
  id?: string
  text: string
}

export const OptionsBuilder = (props: NavIdProps) => {

  const params = useParams<'id'|'qid'>()

  const router = useRouteNavigator()

  const { data: question } = useQuestion(params?.id, params?.qid)

  const {
    mutate: createOptions,
    isPending: isCreatingOptions
  } = useCreateMultipleOptions()

  const [localOptions, setLocalOptions] = useState<LocalOption[]>([])
  const [newOptionText, setNewOptionText] = useState('')
  const lastOptionRef = useRef<HTMLInputElement>(null)
  const [lastOptionIndex, setLastOptionIndex] = useState<number>(-1)
  const [draggable, setDraggable] = useState<boolean>(false)

  const backToQuestion = () => {
    router.push(routes.forms.blank.questions["question-builder"].path, {
      id: params?.id,
      qid: params?.qid
    })
  }

  const removeOptionByIndex = useCallback((index: number) => {
    setLocalOptions(prev => prev.filter((_, i) => i !== index))
  }, [])

  const reorderOptions = useCallback(({ from, to }: { from: number, to: number }) => {
    const _list = [...localOptions]
    _list.splice(from, 1)
    _list.splice(to, 0, localOptions[from])
    setLocalOptions(_list)
  }, [localOptions])

  const handleNewOptionChange = useCallback((value: string) => {
    setNewOptionText(value)
    
    if (value.trim()) {
      const newOption: LocalOption = {
        text: value.trim()
      }
      setLocalOptions(prev => [...prev, newOption])
      setNewOptionText('')
      setLastOptionIndex(localOptions.length)
      setTimeout(() => {
        lastOptionRef.current?.focus()
      }, 0)
    }
  }, [localOptions.length])

  const handleOptionChange = useCallback((index: number, value: string) => {
    setLocalOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, text: value } : option
    ))
  }, [])

  const handleSubmit = () => {
    createOptions({
      formId: params?.id!,
      questionId: params?.qid!,
      data: {
        options: localOptions
      }
    }, {
      onSuccess: () => router.hideModal()
    })
  }

  useEffect(() => {
    if (question?.options) {
      setLocalOptions(question.options.map((option) => ({
        id: option.id,
        text: option.text
      })))
    }
  }, [question?.options])

  return(
    <ModalPage
      header={
        <ModalPageHeader before={<PanelHeaderBack onClick={backToQuestion}/>}>
          Варианты ответа
        </ModalPageHeader>
      }
      onOpen={() => setDraggable(false)}
      {...props}
    >
      <FormItem top='Формат'>
        <Select
          options={[
            { value: 'radio', label: QuestionMultipleTypeDict['radio'] },
          ]}
          defaultValue='radio'
        />
      </FormItem>

      <FormLayoutGroup segmented>
        {draggable ? (
          <React.Fragment>
            <List>
              {localOptions?.map((option, index) => (
                <Option
                  index={index}
                  mode='draggable'
                  key={option?.id || index}
                  getRef={index === lastOptionIndex ? lastOptionRef : undefined}
                  onRemove={removeOptionByIndex}
                  onReorder={reorderOptions}
                  value={option.text}
                />
              ))}
            </List>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {localOptions?.map((option, index) => (
              <Option
                index={index}
                key={option?.id || index}
                getRef={index === lastOptionIndex ? lastOptionRef : undefined}
                onChange={handleOptionChange}
                value={option.text}
              />
            ))}

            {(localOptions.length < 4) && (
              <FormItem>
                <Input
                  name='createoption'
                  placeholder='Введите значение'
                  before={<Icon20RadioOff/>}
                  value={newOptionText}
                  onChange={(e) => handleNewOptionChange(e.target.value)}
                />
              </FormItem>
            )}
          </React.Fragment>
        )}
      </FormLayoutGroup>

      <Div>
        <ButtonGroup gap='s' mode='vertical' stretched>
          <Button
            size='l'
            stretched
            mode='secondary'
            before={draggable ? <Icon20WriteOutline/> : <Icon20ShuffleOutline/>}
            onClick={() => setDraggable(!draggable)}
          >
            {draggable ? 'Изменить текст' : 'Изменить порядок'}
          </Button>

          <Button
            size='l'
            stretched
            loading={isCreatingOptions}
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        </ButtonGroup>
      </Div>
    </ModalPage>
  )
}