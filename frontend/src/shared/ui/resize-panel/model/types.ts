import { NavIdProps } from '@vkontakte/vkui'

export interface ResizePanelProps extends NavIdProps {
  title: string
  before?: React.ReactNode
  after?: React.ReactNode
  children: React.ReactNode
}