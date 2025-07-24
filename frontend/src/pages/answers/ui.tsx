import { ResizePanel } from "@shared/ui"
import { Icon56HourglassErrorBadgeOutline } from "@vkontakte/icons"
import { Group, Header, NavIdProps, Placeholder } from "@vkontakte/vkui"

export const Answers = (props: NavIdProps) => {
  return (
    <ResizePanel
      title={'Мои ответы'}
      {...props}
    >
      <Group header={
        <Header size='l'>Мои ответы</Header>
      }>
        <Placeholder
          icon={<Icon56HourglassErrorBadgeOutline/>}
          title='Здесь пока ничего нет'
        >
          Мы уже работаем над этим разделом.
        </Placeholder>
      </Group>
    </ResizePanel>
  )
}