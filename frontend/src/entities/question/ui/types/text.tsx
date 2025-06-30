import { Div, Input } from "@vkontakte/vkui"

export interface TextQuestionProps {
  readOnly?: boolean
  value?: string
  onChange?: (value: string) => void
}

export const TextQuestion = ({ readOnly, value, onChange }: TextQuestionProps) => {
  return (
    <Div style={{ paddingTop: 0 }}>
      <Input
        readOnly={readOnly}
        placeholder='Напишите что-нибудь...'
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
      />
    </Div>
  )
}