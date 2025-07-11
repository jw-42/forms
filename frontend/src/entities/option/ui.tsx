import { Icon20Cancel, Icon20RadioOff } from "@vkontakte/icons"
import { Cell, FormItem, IconButton, Input } from "@vkontakte/vkui"

export interface OptionItem {
  mode?: 'default' | 'draggable'
  getRef?: React.Ref<HTMLInputElement>
  
  index: number
  value: string

  onChange?: (index: number, value: string) => void
  onRemove?: (index: number) => void
  onReorder?: ({ from, to }: { from: number, to: number }) => void
}

export const Option = ({ mode, index, getRef, value, onChange, onRemove, onReorder }: OptionItem) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(index, e.target.value)
  }

  const handleRemove = () => {
    onRemove?.(index)
  }

  const handleDragFinish = ({ from, to }: { from: number, to: number }) => {
    onReorder?.({ from, to })
  }

  switch (mode) {
    case 'draggable':
      return(
        <Cell
          draggable
          onRemove={handleRemove}
          mode={onRemove ? 'removable' : undefined}
          onDragFinish={handleDragFinish}
        >
          {value}
        </Cell>
      )

    default:
      return(
        <FormItem>
          <Input
            name='option'
            getRef={getRef}
            autoComplete='off'
            placeholder='Введите значение'
            before={<Icon20RadioOff/>}
            after={
              <IconButton onClick={handleRemove}>
                <Icon20Cancel color='var(--vkui--color_icon_secondary)'/>
              </IconButton>
            }
            onChange={handleChange}
            value={value}
          />
        </FormItem>
      )
  }
}