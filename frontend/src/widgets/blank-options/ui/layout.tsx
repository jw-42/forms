import { Cell, Switch } from "@vkontakte/vkui"
import React from "react"

export const BlankOptions = () => {
  return(
    <React.Fragment>
      <Cell
        after={<Switch defaultChecked />}
        extraSubtitle='Мы напишем в личных сообщениях'
      >
        Уведомления об ответах
      </Cell>
    </React.Fragment>
  )
}