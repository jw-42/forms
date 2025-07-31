import { Button, Group, Placeholder, Header, FormLayoutGroup, FormItem, Input, Div, Card, DisplayTitle, Text, Paragraph, Spacing } from '@vkontakte/vkui'
import { Icon28Flash } from '@vkontakte/icons'
import { TopUpBalanceCard } from './card'

export const Balance = () => {
  return(
    <Group
      header={
        <Header size='l'>
          Баланс
        </Header>
      }
    >
      <Placeholder
        icon={<Icon28Flash width={56} height={56} color='var(--vkui--color_icon_positive)' />}
        title='Ваш баланс: 100 бустов'
        action={
          <FormLayoutGroup mode='horizontal'>
            <FormItem>
              <Input
                type='number'
                placeholder='Сколько бустов купить?'
              />
            </FormItem>

            <Button
              size='l'
              mode='primary'
              style={{ marginLeft: 8 }}
            >
              Пополнить
            </Button>
          </FormLayoutGroup>
        }
      >
        Этого хватит, чтобы прокачать 42 анкеты.
      </Placeholder>

      <Div>
        <TopUpBalanceCard
          amount={100}
          price={75}
          discount={25}
        />
      </Div>
    </Group>
  )
}