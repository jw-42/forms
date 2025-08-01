import { Cell, Group, Header, Spinner } from "@vkontakte/vkui"
import { useGetTransactions } from "@entities/payments"
import { 
  getTransactionTypeLabel, 
  getTransactionStatusLabel, 
  getTransactionStatusColor, 
  getTransactionAmountColor, 
  formatTransactionAmount 
} from "@entities/payments"
import { formatDate } from "@shared/lib/date"

export const TransactionsHistory = () => {
  const { data, isLoading, error } = useGetTransactions()

  const renderContent = () => {
    if (isLoading) {
      return (
        <Cell>
          <Spinner size="s" />
        </Cell>
      )
    }

    if (error || !data?.transactions) {
      return (
        <Cell>
          Ошибка загрузки истории
        </Cell>
      )
    }

    if (data.transactions.length === 0) {
      return (
        <Cell>
          История транзакций пуста
        </Cell>
      )
    }

    return data.transactions.map((transaction) => (
      <Cell
        key={transaction.external_id}
        extraSubtitle={formatDate(new Date(transaction.created_at))}
        indicator={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ 
              color: getTransactionStatusColor(transaction.status),
              fontSize: '12px'
            }}>
              {getTransactionStatusLabel(transaction.status)}
            </span>
            <span style={{ 
              color: getTransactionAmountColor(transaction.boosts_amount)
            }}>
              {formatTransactionAmount(transaction.boosts_amount)}
            </span>
          </div>
        }
      >
        {getTransactionTypeLabel(transaction.type)}
      </Cell>
    ))
  }

  return (
    <Group
      header={
        <Header size='l'>
          История транзакций
        </Header>
      }
    >
      {renderContent()}
    </Group>
  )
} 