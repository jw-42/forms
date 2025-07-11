import { MoreButton, QuestionMoreButton } from "@shared/ui"
import { QuestionItemProps, QuestionTypeDict } from "../types"
import { SimpleCell } from "@vkontakte/vkui"
import { TextQuestion, RadioQuestion } from "./types"
import React from "react"
import { useForm } from "@entities/form/hooks"

export const QuestionItem = (props: QuestionItemProps) => {

  const { data: form } = useForm(props.form_id)

  return (
    <React.Fragment>
      <SimpleCell
        subtitle={QuestionTypeDict[props.type]}
        after={(form?.can_edit) && (
          <MoreButton items={
            <QuestionMoreButton formId={props.form_id} questionId={props.id} />
          } />
        )}
      >
        {props.text}
      </SimpleCell>

      {props.type === 'text' && <TextQuestion {...props} />}
      {props.type === 'radio' && <RadioQuestion {...props} />}
    </React.Fragment>
  )
}