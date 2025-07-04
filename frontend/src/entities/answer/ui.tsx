import { QuestionItem } from "@entities/question"
import { AnswersGroupItemProps } from "./types"

export interface AnswerItemProps {
  id: string
  user_id: string
  created_at: string
}

export const AnswerItem = (props: AnswersGroupItemProps & { form_id: string }) => {
  return (
    <QuestionItem
      id={props.question.id}
      type={props.question.type as 'text'}
      form_id={props.form_id}
      text={props.question.text}
      readOnly={true}
      value={props.value}
    />
  )
}