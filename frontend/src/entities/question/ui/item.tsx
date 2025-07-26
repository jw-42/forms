import { MoreButton, QuestionMoreButton } from "@shared/ui"
import { QuestionItemProps, QuestionTypeDict } from "../types"
import { SimpleCell } from "@vkontakte/vkui"
import { TextQuestion, RadioQuestion, LongTextQuestion } from "./types"
import React from "react"
import { useForm } from "@entities/form/hooks"

export const QuestionItem = (props: QuestionItemProps) => {

  const { data: form } = useForm(props.form_id)

  return (
    <React.Fragment>
      <SimpleCell
        multiline
        subtitle={QuestionTypeDict[props.type]}
        after={(form?.can_edit) && (
          <MoreButton items={
            <QuestionMoreButton formId={props.form_id} questionId={props.id} />
          } />
        )}
      >
        {props.text} {props.required && <span style={{ color: 'var(--vkui--color_text_negative)' }}>*</span>}
      </SimpleCell>

      {props.type === 'text' && <TextQuestion {...props} />}
      {props.type === 'long_text' && <LongTextQuestion {...props} />}
      {props.type === 'radio' && <RadioQuestion {...props} />}
    </React.Fragment>
  )
}