import React from "react"
import { Placeholder } from "@vkontakte/vkui"

import { FormsListProps } from "./types"
import { FormCell, useForms } from "@entities/form"

export const FormsList = ({ mode = 'default' }: FormsListProps) => {

  const { data: forms } = useForms()

  return (
    <React.Fragment>
      {mode === 'default' && (
        forms?.length ? forms.map((form, index) => (
          <FormCell key={index} {...form} />
        )) : (
          <Placeholder>
            Здесь будут отображаться созданные тобой анкеты.
          </Placeholder>
        )
      )}

      {(mode === 'favorites') && (
        <Placeholder>
          {mode === 'favorites' && 'Здесь будут отображаться сохраненные анкеты.'}
        </Placeholder>
      )}
    </React.Fragment>
  )
}