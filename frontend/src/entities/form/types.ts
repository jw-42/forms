export interface FormBaseProps {
  id: string
  title: string
  updated_at: string
}

export interface FormDetailProps extends FormBaseProps {
  owner_id: number
  description: string
  created_at: string
  can_edit: boolean
  has_answer: boolean
}

export interface CreateFormProps {
  title: string
  description: string
}

export interface UpdateFormProps {
  title?: string
  description?: string
}