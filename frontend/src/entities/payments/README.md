# Payments API

Модуль для работы с платежным API на клиенте.

## Структура

```
payments/
├── api.ts          # API методы для работы с платежами
├── hooks.ts        # React Query хуки
├── types.ts        # TypeScript типы
├── utils.ts        # Утилиты для работы с транзакциями
└── index.ts        # Экспорты модуля
```

## API методы

### `paymentsApi.getBalance()`
Получает баланс пользователя.

**Возвращает:** `Promise<BalanceInfo>`

```typescript
interface BalanceInfo {
  balance: number
}
```

### `paymentsApi.getTransactions()`
Получает историю транзакций пользователя.

**Возвращает:** `Promise<TransactionsResponse>`

```typescript
interface TransactionsResponse {
  transactions: Transaction[]
}

interface Transaction {
  external_id: string
  type: 'purchase' | 'gift' | 'refund' | 'bonus' | 'subscription' | 'adjustment'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  boosts_amount: number
  votes_amount: number
  created_at: string
}
```

## Хуки

### `useGetBalance()`
Хук для получения баланса пользователя с кешированием.

**Возвращает:** `UseQueryResult<BalanceInfo>`

### `useGetTransactions()`
Хук для получения истории транзакций с кешированием.

**Возвращает:** `UseQueryResult<TransactionsResponse>`

## Утилиты

### `getTransactionTypeLabel(type: Transaction['type']): string`
Возвращает человекочитаемую метку типа транзакции.

### `getTransactionStatusLabel(status: Transaction['status']): string`
Возвращает человекочитаемую метку статуса транзакции.

### `getTransactionStatusColor(status: Transaction['status']): string`
Возвращает цвет для статуса транзакции.

### `getTransactionAmountColor(amount: number): string`
Возвращает цвет для суммы транзакции.

### `formatTransactionAmount(amount: number): string`
Форматирует сумму транзакции с префиксом +/-.

### `filterTransactionsByType(transactions, type)`
Фильтрует транзакции по типу.

### `filterTransactionsByStatus(transactions, status)`
Фильтрует транзакции по статусу.

### `getCompletedTransactions(transactions)`
Возвращает только завершенные транзакции.

### `getPurchaseTransactions(transactions)`
Возвращает только транзакции покупок.

## Примеры использования

```typescript
import { useGetBalance, useGetTransactions, getCompletedTransactions } from '@entities/payments'

// Получение баланса
const { data: balance, isLoading } = useGetBalance()

// Получение транзакций
const { data: transactions, isLoading } = useGetTransactions()

// Фильтрация завершенных транзакций
const completedTransactions = getCompletedTransactions(transactions?.transactions || [])
```

## Виджеты

### `BalanceHistory`
Виджет для отображения истории пополнений баланса.

### `TransactionsHistory`
Виджет для отображения полной истории транзакций.

## Интеграция с backend

Модуль интегрирован с backend API:
- `/payments/balance` - получение баланса
- `/payments/transactions` - получение истории транзакций

Все запросы требуют авторизации пользователя. 