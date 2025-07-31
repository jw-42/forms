import { Card, DisplayTitle, Tappable, Cell, ContentBadge } from '@vkontakte/vkui'

export interface TopUpBalanceCardProps {
  amount: number
  price: number
  discount: number
}

export const TopUpBalanceCard = ({ amount, price, discount }: TopUpBalanceCardProps) => {

  const handleTopUp = () => {
    console.log(`Пополнить баланс на ${amount} бустов за ${price} голосов (-${discount}%)`)
  }

  return(
    <Tappable onClick={handleTopUp}>
      <Card mode='outline-tint'>
        <Cell
          extraSubtitle='Специальное предложение'
          badgeAfterTitle={
            <ContentBadge size='m' appearance='accent-red' mode='primary'>
              -{discount}%
            </ContentBadge>
          }
          after={
            <DisplayTitle level='4' style={{ color: 'var(--vkui--color_text_primary)' }}>
              {price} голосов
            </DisplayTitle>
          }
        >
          <DisplayTitle level='4' style={{ color: 'var(--vkui--color_text_accent)' }}>
            {amount} бустов
          </DisplayTitle>
        </Cell>
      </Card>
    </Tappable>
  )
}