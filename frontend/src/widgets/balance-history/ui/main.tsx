import { Cell, Group, Header } from "@vkontakte/vkui"

export const BalanceHistory = () => {
  return(
    <Group
      header={
        <Header size='l'>
          История пополнений
        </Header>
      }
    >
      <Cell
        extraSubtitle='вчера в 12:00'
        indicator={
          <span>+100 бустов</span>
        }
      >
        Пополнение баланса
      </Cell>
    </Group>
  )
}