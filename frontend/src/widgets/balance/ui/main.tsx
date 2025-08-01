import { Button, Group, Placeholder, Header, FormLayoutGroup, FormItem, Input, Div } from '@vkontakte/vkui'
import { Icon28Flash } from '@vkontakte/icons'
import { TopUpBalanceCard } from './card'
import { paymentKeys, useGetBalance } from '@entities/payments'
import bridge from '@vkontakte/vk-bridge'
import { useState } from 'react'
import { queryClient } from '@shared/api'
import { declOfNum } from '@shared/utils'

export const Balance = () => {
  const { data: balanceData } = useGetBalance()
  const [customAmount, setCustomAmount] = useState('')
  
  const balance = balanceData?.balance || 0
  
  const handleShowOrderBox = async (itemId: string) => {
    try {
      const result = await bridge.send('VKWebAppShowOrderBox', {
        item: itemId,
        type: 'item',
      })
      
      if (result && 'success' in result && result.success) {
        queryClient.invalidateQueries({ queryKey: paymentKeys.balance() })
      } else {
        console.log('Purchase failed:', result)
      }
    } catch (error) {
      console.error('Error showing order box:', error)
    }
  }

  const handleCustomTopUp = async () => {
    const amount = parseInt(customAmount)
    if (!amount || amount <= 0) return
    
    const itemId = `buy_bust_${amount}`
    await handleShowOrderBox(itemId)
  }
  
  const handleSpecialOffer = async () => {
    await handleShowOrderBox('buy_bust_100')
  }
  
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
        title={`Ваш баланс: ${balance} ${declOfNum(balance, ['буст', 'буста', 'бустов'])}`}
        action={
          <FormLayoutGroup mode='horizontal'>
            <FormItem>
              <Input
                type='number'
                placeholder='Сколько бустов купить?'
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </FormItem>

            <Button
              size='l'
              mode='primary'
              style={{ marginLeft: 8 }}
              onClick={handleCustomTopUp}
              disabled={!customAmount || parseInt(customAmount) <= 0}
            >
              Пополнить
            </Button>
          </FormLayoutGroup>
        }
      >
        Этого хватит, чтобы прокачать {Math.floor(balance / 4)} {declOfNum(Math.floor(balance / 4), ['анкету', 'анкеты', 'анкет'])}
      </Placeholder>

      <Div>
        <TopUpBalanceCard
          amount={100}
          price={75}
          discount={25}
          onTopUp={handleSpecialOffer}
        />
      </Div>
    </Group>
  )
}