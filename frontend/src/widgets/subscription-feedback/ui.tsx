import { Icon20SendOutline, Icon24Camera } from '@vkontakte/icons'
import { Avatar, Cell, Div, FormItem, Group, Header, IconButton, Input, Paragraph, UsersStack } from '@vkontakte/vkui'

export const SubscriptionFeedback = () => {
  return(
    <Group
      header={<Header size='l'>Отзывы</Header>}
    >
      <Cell
        extraSubtitle='подписан 3 месяца'
        before={
          <Avatar
            size={40}
            fallbackIcon={<Icon24Camera/>}
            src='https://sun6-23.userapi.com/s/v1/ig2/FCzAfuVVwEVqbDLVFYxdVB3VxtQBZ7npXI7mUQhEjtWxnXzLHKBwn6vE7jMESoPzbxLl_WaI7PAnNpyc7FQ-a287.jpg?quality=95&crop=334,418,1073,1073&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&u=ZYwsSQgGn-GlHijaGIIpPk_ozb-wstI9CRn-Nrqh9dc&cs=50x50'
          />
        }
      >
        Владислав Лаукман
      </Cell>

      <Div style={{ paddingTop: 4 }}>
        <Paragraph>
          Спасибо за сервис! Очень удобно создавать анкеты и получать ответы.
        </Paragraph>
      </Div>

      <FormItem>
        <Input
          placeholder='Расскажи о своем опыте'
          after={
            <IconButton onClick={() => {}} disabled>
              <Icon20SendOutline/>
            </IconButton>
          }
        />
      </FormItem>
    </Group>
  )
}