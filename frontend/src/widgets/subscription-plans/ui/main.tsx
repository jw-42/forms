import { 
  Group, 
  Header, 
  HorizontalScroll} from '@vkontakte/vkui'
import { 
  Icon28DiamondOutline,
  Icon28DiscountOutline,
  Icon28CrownOutline} from '@vkontakte/icons'
import { Plan } from '../types'
import { SubscriptionCard } from './card'

export const SubscriptionPlans = () => {
  const plans: Plan[] = [
    {
      id: 'free',
      title: 'Бесплатный',
      price: 0,
      period: 'навсегда',
      description: 'Для начала работы',
      icon: <Icon28DiscountOutline width={32} height={32} />,
      features: [
        { text: '1 анкета', included: true },
        { text: '5 вопросов максимум', included: true },
        { text: 'Продвинутые типы вопросов', included: false },
        { text: 'Умное создание анкет, вопросов', included: false },
        { text: 'Продвинутая аналитика', included: false },
        { text: 'Интеграция с CRM', included: false },
      ],
      buttonText: 'Текущий план',
      itemId: 'free'
    },
    {
      id: 'standard',
      title: 'Стандарт',
      price: 20,
      period: 'в месяц',
      description: 'Для активных пользователей',
      icon: <Icon28CrownOutline width={32} height={32} />,
      features: [
        { text: '5 анкет', included: true },
        { text: '10 вопросов максимум', included: true },
        { text: 'Продвинутые типы вопросов', included: true },
        { text: 'Умное создание анкет, вопросов', included: true },
        { text: 'Продвинутая аналитика', included: false },
        { text: 'Интеграция с CRM', included: false },
      ],
      popular: true,
      buttonText: 'Выбрать',
      itemId: 'standard_30'
    },
    {
      id: 'premium',
      title: 'Премиум',
      price: 30,
      period: 'в месяц',
      description: 'Для профессионалов',
      icon: <Icon28DiamondOutline width={32} height={32} />,
      features: [
        { text: 'Неограниченные анкеты', included: true },
        { text: '50 вопросов максимум', included: true },
        { text: 'Продвинутые типы вопросов', included: true },
        { text: 'Умное создание анкет, вопросов', included: true },
        { text: 'Продвинутая аналитика', included: true },
        { text: 'Интеграция с CRM', included: true },
      ],
      buttonText: 'Выбрать',
      itemId: 'premium_30'
    }
  ]

  return (
    <Group
      header={
        <Header size='l' style={{ paddingLeft: 20, paddingBottom: 6 }}>
          Тарифы
        </Header>
      }
      style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 18 }}
    >
      <HorizontalScroll
        showArrows
        getScrollToRight={(i) => i+200}
        getScrollToLeft={(i) => i-200}
      >
        <div style={{ display: 'flex', gap: 12, padding: '0 16px' }}>
          {plans.map((plan) => (
            <SubscriptionCard key={plan.id} plan={plan} />
          ))}
        </div>
      </HorizontalScroll>
    </Group>
  )
}