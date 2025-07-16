import { Cell, Switch } from "@vkontakte/vkui"
import React from "react"

export const BlankOptions = () => {
  return(
    <React.Fragment>
      <Cell
        disabled
        multiline
        after={<Switch disabled />}
        extraSubtitle='Мы напишем в личных сообщениях'
      >
        Уведомления об ответах
      </Cell>
    </React.Fragment>
  )
}