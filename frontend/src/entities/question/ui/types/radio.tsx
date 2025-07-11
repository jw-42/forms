import { useForm } from "@entities/form"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Radio, Placeholder, Button } from "@vkontakte/vkui"
import { QuestionItemProps } from "../../types"
import { routes } from "@shared/model"
import React from "react"
import { Icon20ListPlusOutline } from "@vkontakte/icons"

export interface RadioQuestionProps {
  readOnly?: boolean
  options?: {
    id: string
    text: string
  }[]
  value?: string
  onChange?: (value: string) => void
}

export const RadioQuestion = ({ id, form_id, readOnly, options, value, onChange }: QuestionItemProps) => {

  const router = useRouteNavigator()
  const { data: form } = useForm(form_id)

  const handleAddOption = () => {
    router.push(routes.forms.blank.questions["options-builder"].path, {
      id: form_id,
      qid: id
    })
  }

  return (
    <React.Fragment>
      {(options && options.length > 0) ? (
        options.map((option) => (
          <Radio
            key={option.id}
            checked={value === option.id}
            onChange={() => onChange?.(option.id)}
            disabled={readOnly}
          >
            {option.text}
          </Radio>
        ))
      ) : (
        <Placeholder
          action={
            (form?.can_edit) && (
              <Button
                size='m'
                mode='secondary'
                onClick={handleAddOption}
                before={<Icon20ListPlusOutline/>}
              >
                Добавить вариант
              </Button>
            )
          }
        >
          Здесь пока нет вариантов ответа
        </Placeholder>
      )}
    </React.Fragment>
  )
}