import { useDeleteForm } from "@entities/form"
import { MODALS, routes } from "@shared/model"
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { ActionSheetItem } from "@vkontakte/vkui"
import React from "react"

interface FormActionsSheetProps {
  formId?: string
  canEdit?: boolean
  canDelete?: boolean
}

export const FormActionsSheet = ({ formId, canEdit, canDelete=true }: FormActionsSheetProps) => {

  const router = useRouteNavigator()
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation()

  const { mutate: deleteForm } = useDeleteForm()

  const handleDeleteForm = () => {
    if (formId) {
      if (activeView !== 'forms' || activePanel !== 'overview') {
        router.push(routes.forms.overview.path)
      }

      deleteForm(formId)
    }
  }

  return (
    <React.Fragment>
      {canEdit && (
        <ActionSheetItem onClick={() => router.showModal(MODALS.BLANK_BUILDER)}>
          Редактировать
        </ActionSheetItem>
      )}

      {canDelete && (
        <ActionSheetItem mode='destructive' onClick={handleDeleteForm} disabled={!formId}>
          Удалить анкету
        </ActionSheetItem>
      )}
    </React.Fragment>
  )
}