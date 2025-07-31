import { Button, Group, Placeholder, Header, FormLayoutGroup, FormItem, Input, Div, Card, DisplayTitle, Text, Paragraph, Spacing } from '@vkontakte/vkui'
import { Icon28Flash } from '@vkontakte/icons'
import { TopUpBalanceCard } from './card'
import { useGetBalance } from '@entities/balance'
import bridge from '@vkontakte/vk-bridge'
import { useState } from 'react'

export const Balance = () => {
  const { data: balanceData } = useGetBalance()
  const [customAmount, setCustomAmount] = useState('')
  
  const balance = balanceData?.balance || 0
  
  const handleCustomTopUp = async () => {
    const amount = parseInt(customAmount)
    if (!amount || amount <= 0) return
    
    const itemId = `buy_bust_${amount}`
    
    try {
      const result = await bridge.send('VKWebAppShowOrderBox', {
        item: itemId,
        type: 'item',
      })
      
      if (result && 'result' in result && result.result) {
        console.log('Purchase successful:', result)
        // Здесь можно добавить обновление баланса
      } else {
        console.log('Purchase failed:', result)
      }
    } catch (error) {
      console.error('Error showing order box:', error)
    }
  }
  
  const handleSpecialOffer = async () => {
    try {
      const result = await bridge.send('VKWebAppShowOrderBox', {
        item: 'buy_bust_100',
        type: 'item',
      })
      
      if (result && 'result' in result && result.result) {
        console.log('Special offer purchase successful:', result)
        // Здесь можно добавить обновление баланса
      } else {
        console.log('Special offer purchase failed:', result)
      }
    } catch (error) {
      console.error('Error showing order box:', error)
    }
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
        title={`Ваш баланс: ${balance} бустов`}
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
        Этого хватит, чтобы прокачать {Math.floor(balance / 2.4)} анкет.
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