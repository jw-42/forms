import { Icon24MoreHorizontal } from "@vkontakte/icons"
import { ActionSheet, IconButton } from "@vkontakte/vkui"
import { useRef } from "react"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { MoreButtonProps } from "./types"

export const MoreButton = ({ items, disabled, ...props }: MoreButtonProps) => {

  const router = useRouteNavigator()
  const toggleRef = useRef<HTMLDivElement>(null)

  const handleClosePopout = () => router.hidePopout()

  return (
    <IconButton
      disabled={disabled}
      getRootRef={toggleRef}
      onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        
        router.showPopout(
          <ActionSheet
            {...props}
            onClose={handleClosePopout}
            toggleRef={toggleRef}
          >
            {items}
          </ActionSheet>
        )
      }}
    >
      <Icon24MoreHorizontal color='var(--vkui--color_icon_secondary)' />
    </IconButton>
  )
}