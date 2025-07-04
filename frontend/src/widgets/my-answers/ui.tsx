import { useMyAnswers } from "@entities/answer"
import { FormCell } from "@entities/form"
import { Group, Header } from "@vkontakte/vkui"
import React from "react"

export const MyAnswers = () => {

  const { data: answers } = useMyAnswers()
  
  return (
    <React.Fragment>
      <Group header={<Header size="s">Мои ответы</Header>}>
        {answers?.map((answer) => (
          <FormCell
            key={answer.id}
            id={answer.form.id}
            title={answer.form.title}
            updated_at={answer.created_at}
          />
        ))}
      </Group>
    </React.Fragment>
  )
}