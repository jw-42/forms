import { MoreButton, QuestionMoreButton } from "@shared/ui"
import { QuestionItemProps, PARSE_TYPE } from "../types"
import { SimpleCell } from "@vkontakte/vkui"
import { TextQuestion } from "./types"
import React from "react"

export const QuestionItem = ({ id, form_id, text, type, readOnly, value, onChange }: QuestionItemProps) => {
  return (
    <React.Fragment>
      <SimpleCell
        subtitle={PARSE_TYPE[type]}
        after={(!readOnly) && (
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