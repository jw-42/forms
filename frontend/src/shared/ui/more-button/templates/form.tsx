import React from "react"
import { MODALS, routes } from "@shared/model"
import { ActionSheetItem } from "@vkontakte/vkui"
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { useDeleteForm } from "@entities/form"

interface FormMoreButtonProps {
  formId?: string
  canEdit?: boolean
}

export const FormMoreButton = ({ formId, canEdit }: FormMoreButtonProps) => {

  const router = useRouteNavigator()
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation()

  const { mutate: deleteForm } = useDeleteForm()

  const handleEditForm = () => {    
    setTimeout(() => {
      router.showModal(MODALS.BLANK_BUILDER)
    }, 100)
  }

  const handleDeleteForm = () => {    
    if (formId) {
      if (activeView !== 'forms' || activePanel !== 'overview') {
        router.push(routes.forms.overview.path)
      }
  
      deleteForm(formId)
    }
  }

  return(
    <React.Fragment>
      {!canEdit && (
        <ActionSheetItem>
          Нет доступных действий
        </ActionSheetItem>
      )}

      {canEdit && (
        <ActionSheetItem onClick={handleEditForm}>
          Редактировать
        </ActionSheetItem>
      )}

      {canEdit && (
        <ActionSheetItem mode='destructive' onClick={handleDeleteForm}>
          Удалить
        </ActionSheetItem>
      )}
    </React.Fragment>
  )
}