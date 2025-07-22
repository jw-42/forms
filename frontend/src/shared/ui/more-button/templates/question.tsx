import { useDeleteQuestion } from "@entities/question/hooks"
import { routes } from "@shared/model"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { ActionSheetItem } from "@vkontakte/vkui"
import React from "react"

export interface QuestionMoreButtonProps {
  formId: string
  questionId: number
}

export const QuestionMoreButton = ({ formId, questionId }: QuestionMoreButtonProps) => {

  const router = useRouteNavigator()

  const { mutate: deleteQuestion } = useDeleteQuestion()

  const handleEditQuestion = () => {
    setTimeout(() => {
      router.push(routes.forms.blank.questions["question-builder"].path, {
        'id': formId,
        'qid': String(questionId)
      })
    }, 100)
  }

  const handleDeleteQuestion = () => {
    deleteQuestion({ formId, questionId })
  }

  return (
    <React.Fragment>
      <ActionSheetItem onClick={handleEditQuestion}>
        Редактировать
      </ActionSheetItem>

      <ActionSheetItem onClick={handleDeleteQuestion} mode='destructive'>
        Удалить вопрос
      </ActionSheetItem>
    </React.Fragment>
  )
}