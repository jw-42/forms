import { ResizePanel } from "@shared/ui"
import { NavIdProps } from "@vkontakte/vkui"
import { MyAnswers } from "@widgets/my-answers"

export const Answers = (props: NavIdProps) => {
  return (
    <ResizePanel
      title={'Мои ответы'}
      {...props}
    >
      <MyAnswers />
    </ResizePanel>
  )
}