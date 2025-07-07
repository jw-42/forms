import { ResizePanel } from "@shared/ui"
import { Group, Header, NavIdProps, Placeholder } from "@vkontakte/vkui"

export const Answers = (props: NavIdProps) => {
  return (
    <ResizePanel
      title={'Мои ответы'}
      {...props}
    >
      <Group header={
        <Header size='s'>Мои ответы</Header>
      }>
        <Placeholder>
          Здесь пока ничего нет.
        </Placeholder>
      </Group>
    </ResizePanel>
  )
}