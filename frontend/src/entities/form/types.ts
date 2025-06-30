export interface FormBaseProps {
  id: string
  title: string
  updated_at: string
}

export interface FormDetailProps extends FormBaseProps {
  description: string
  created_at: string
}

export interface CreateFormProps {
  title: string
  description: string
}

export interface UpdateFormProps {
  title?: string
  description?: string
}