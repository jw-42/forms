import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { NavIdProps, PanelHeaderBack } from '@vkontakte/vkui'
import { ResizePanel, routes } from '@shared/index'

import { SubscriptionBenefits, SubscriptionCTA, SubscriptionFeedback, Balance, BalanceHistory, SubscriptionPlans } from '@widgets/index'
import { useGetSubscriptions } from '@entities/subscriptions'

export const Subscription = (props: NavIdProps) => {

  const router = useRouteNavigator()
  const { data: subscriptions } = useGetSubscriptions()

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
      {/* <BalanceHistory />
      <SubscriptionBenefits />
      <SubscriptionPlans />
      <SubscriptionFeedback />
      {subscriptions?.length === 0 && <SubscriptionCTA />}       */}
    </ResizePanel>
  )
}