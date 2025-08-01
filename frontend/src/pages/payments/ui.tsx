import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { NavIdProps, PanelHeaderBack } from '@vkontakte/vkui'
import { ResizePanel, routes } from '@shared/index'

import { Balance, TransactionsHistory } from '@widgets/index'

export const Payments = (props: NavIdProps) => {

  const router = useRouteNavigator()

  const handleBack = () => {
    router.push(routes.forms.overview.path)
  }

  return(
    <ResizePanel
      title='Подписка'
      before={<PanelHeaderBack onClick={handleBack} />}
      {...props}
    >
      <Balance />
      <TransactionsHistory />
    </ResizePanel>
  )
}