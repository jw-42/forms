import { ActionSheetProps } from "@vkontakte/vkui"

export interface MoreButtonProps extends Omit<ActionSheetProps, 'onClose' | 'toggleRef'> {
  items: JSX.Element
  disabled?: boolean
}