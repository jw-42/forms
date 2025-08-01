import { Cell, Group, Header, Spinner } from "@vkontakte/vkui"
import { useGetTransactions, getPurchaseTransactions, getCompletedTransactions, formatTransactionAmount } from "@entities/payments"
import { formatDate } from "@shared/lib/date"

export const BalanceHistory = () => {
  const { data, isLoading, error } = useGetTransactions()

  if (isLoading) {
    return (
      <Group
        header={
          <Header size='l'>
            История пополнений
          </Header>
        }
      >
        <Cell>
          <Spinner size="s" />
        </Cell>
      </Group>
    )
  }

  if (error || !data?.transactions) {
    return (
      <Group
        header={
          <Header size='l'>
            История пополнений
          </Header>
        }
      >
        <Cell>
          Ошибка загрузки истории
        </Cell>
      </Group>
    )
  }

  const purchaseTransactions = getPurchaseTransactions(data.transactions)
  const completedPurchases = getCompletedTransactions(purchaseTransactions)

  if (completedPurchases.length === 0) {
    return (
      <Group
        header={
          <Header size='l'>
            История пополнений
          </Header>
        }
      >
        <Cell>
          История пополнений пуста
        </Cell>
      </Group>
    )
  }

  return(
    <Group
      header={
        <Header size='l'>
          История пополнений
        </Header>
      }
    >
      {completedPurchases.map((transaction) => (
        <Cell
          key={transaction.external_id}
          extraSubtitle={formatDate(new Date(transaction.created_at))}
          indicator={
            <span>{formatTransactionAmount(transaction.boosts_amount)}</span>
          }
        >
          Пополнение баланса
        </Cell>
      ))}
    </Group>
  )
}