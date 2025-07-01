import { MoreButton, QuestionMoreButton } from "@shared/ui"
import { QuestionItemProps, PARSE_TYPE } from "../types"
import { SimpleCell } from "@vkontakte/vkui"
import { TextQuestion } from "./types"
import React from "react"
import { useForm } from "@entities/form/hooks"

export const QuestionItem = ({ id, form_id, text, type, readOnly, value, onChange }: QuestionItemProps) => {

  const { data: form } = useForm(form_id)

  return (
    <React.Fragment>
      <SimpleCell
        subtitle={PARSE_TYPE[type]}
        after={(!readOnly && form?.can_edit) && (
          <MoreButton items={
            <QuestionMoreButton formId={form_id} questionId={id} />
          } />
        )}
      >
        {text}
      </SimpleCell>

      {type === 'text' && (
        <TextQuestion readOnly={readOnly} value={value} onChange={onChange} />
      )}
    </React.Fragment>
  )
}