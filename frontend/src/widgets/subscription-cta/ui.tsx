import { SubscriptionButton } from '@features/subscription-button'
import { Div, Group, Spacing, UsersStack } from '@vkontakte/vkui'

export const SubscriptionCTA = () => {
  return(
    <Group>
      <Div>
        <UsersStack
          size='m'
          count={42}
          avatarsPosition='block-start'
          photos={['https://sun6-23.userapi.com/s/v1/ig2/FCzAfuVVwEVqbDLVFYxdVB3VxtQBZ7npXI7mUQhEjtWxnXzLHKBwn6vE7jMESoPzbxLl_WaI7PAnNpyc7FQ-a287.jpg?quality=95&crop=334,418,1073,1073&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&u=ZYwsSQgGn-GlHijaGIIpPk_ozb-wstI9CRn-Nrqh9dc&cs=50x50']}
        >
          Владислав и другие доверяют нам. Присоединяйся и ты!
        </UsersStack>

        <Spacing size={16} />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SubscriptionButton
            title='Подключить'
            itemId='standard_30'
          />
        </div>
      </Div>
    </Group>
  )
}