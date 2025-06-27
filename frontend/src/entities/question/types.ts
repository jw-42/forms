export interface QuestionProps {
  id: string
  type: 'text'
  form_id: string
  text: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}