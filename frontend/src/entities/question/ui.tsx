import { Icon24MoreHorizontal } from "@vkontakte/icons"
import { ActionSheet, ActionSheetItem, Div, IconButton, Input, SimpleCell } from "@vkontakte/vkui"
import React, { useRef } from "react"
import { QuestionProps } from "./types"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { useDeleteQuestion } from "./hooks"
import { routes } from '@shared/index'

const TYPE = {
  text: 'Текстовый вопрос'
} as const

export const Question = ({ type, text, id, form_id }: QuestionProps) => {

  const toggleRef = useRef<HTMLDivElement>(null)
  const router = useRouteNavigator()

  const { mutate: deleteQuestion } = useDeleteQuestion()

  const handleEditQuestion = () => {
    setTimeout(() => {
      router.push(routes.forms.blank.questions["question-builder"].path, {
        'id': form_id,
        'qid': id
      })
    }, 100)
  }

  const handleOpenOptions = () => router.showPopout(
    <ActionSheet
      onClose={() => router.hidePopout()}
      placement='bottom-end'
      toggleRef={toggleRef}
    >
      <ActionSheetItem onClick={handleEditQuestion}>
        Редактировать
      </ActionSheetItem>

      <ActionSheetItem
        mode='destructive'
        onClick={() => deleteQuestion({ formId: form_id, questionId: id })}
      >
        Удалить вопрос
      </ActionSheetItem>
    </ActionSheet>
  )

  return (
    <React.Fragment>
      <SimpleCell
        subtitle={TYPE[type] ?? 'Категория вопроса'}
        after={
          <IconButton getRootRef={toggleRef} onClick={handleOpenOptions}>
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