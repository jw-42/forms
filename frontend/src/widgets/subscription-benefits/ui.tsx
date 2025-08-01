import { Icon28MagicWandOutline, Icon28NewsfeedOutline, Icon28StatisticsOutline } from '@vkontakte/icons'
import { Cell, Div, Group, Header, Spacing } from '@vkontakte/vkui'
import { SubscriptionButton } from '@features/index'
import React from 'react'

export const SubscriptionBenefits = () => {

  return(
    <Group
      header={
        <Header size='l'>
          Преимущества подписки
        </Header>
      }
    >
      <Cell
        multiline
        before={<Icon28MagicWandOutline/>}
        extraSubtitle='Мы сгенерируем описание, вопросы и варианты'
        onClick={() => {}}
        chevron='always'
      >
        Создавай анкеты в один клик
      </Cell>

      <Cell
        multiline
        before={<Icon28StatisticsOutline/>}
        extraSubtitle='Детальные отчёты и возможность экспорта данных'
        onClick={() => {}}
        chevron='always'
      >
        Продвинутая аналитика
      </Cell>

      <Cell
        multiline
        before={<Icon28NewsfeedOutline/>}
        extraSubtitle='Для тебя и всех, кто просматривает твои анкеты'
        onClick={() => {}}
        chevron='always'
      >
        Отключение рекламы
      </Cell>
    </Group>
  )
}