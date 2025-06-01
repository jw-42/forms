import { Icon24MoreHorizontal } from "@vkontakte/icons"
import { Div, IconButton, Input, SimpleCell } from "@vkontakte/vkui"
import React from "react"
import { QuestionProps } from "./types"

const TYPE = {
  text: 'Текстовый вопрос'
} as const

export const Question = ({ type, text }: QuestionProps) => {
  return (
    <React.Fragment>
      <SimpleCell
        subtitle={TYPE[type] ?? 'Категория вопроса'}
        after={
          <IconButton>
            <Icon24MoreHorizontal color='var(--vkui--color_icon_secondary)' />
          </IconButton>
        }
      >
        {text}
      </SimpleCell>

      <Div style={{ paddingTop: 0 }}>
        <Input placeholder='Напишите что-нибудь...' />
      </Div>
    </React.Fragment>
  )
}