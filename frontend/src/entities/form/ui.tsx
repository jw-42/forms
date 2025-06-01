import { ActionSheet, IconButton } from "@vkontakte/vkui"
import { Cell } from "@vkontakte/vkui"
import { Icon24MoreHorizontal } from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes } from "@shared/model/routes"
import { FormActionsSheet, useAutoUpdateTime } from '@shared/index'
import { FormBaseProps } from "./types"
import { useRef } from "react"

export const FormCell = ({ id, updated_at, title }: FormBaseProps) => {

  const ref = useRef(null)
  const router = useRouteNavigator()
  const formattedDate = useAutoUpdateTime(updated_at)

  const handleOpenDetails = (e: React.MouseEvent<HTMLElement,MouseEvent>) => {
    e.stopPropagation()

    router.showPopout(
      <ActionSheet
        onClose={() => router.hidePopout()}
        onClick={(e) => e.stopPropagation()}
        placement='bottom-end'
        toggleRef={ref}
      >
        <FormActionsSheet formId={id} />
      </ActionSheet>
    )
  }

  return (
    <Cell
      onClick={() => router.push(routes.forms.blank.path, { id })}
      subtitle={formattedDate}
      after={
        <IconButton getRootRef={ref} onClick={handleOpenDetails}>
          <Icon24MoreHorizontal/>
        </IconButton>
      }
    >
      {title}
    </Cell>
  )
}