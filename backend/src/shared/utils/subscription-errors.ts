export class SubscriptionNotFoundError extends Error {
  constructor(item: string) {
    super(`Подписка "${item}" не найдена`)
    this.name = 'SubscriptionNotFoundError'
  }
}

export class ItemNotFoundError extends Error {
  constructor(item: string) {
    super(`Товар "${item}" не найден`)
    this.name = 'ItemNotFoundError'
  }
}

export class SubscriptionLimitExceededError extends Error {
  constructor(action: string, current: number, max: number) {
    super(`Лимит превышен для действия "${action}": ${current}/${max}`)
    this.name = 'SubscriptionLimitExceededError'
  }
}

export class SubscriptionRequiredError extends Error {
  constructor(feature: string) {
    super(`Для доступа к функции "${feature}" требуется подписка`)
    this.name = 'SubscriptionRequiredError'
  }
} 