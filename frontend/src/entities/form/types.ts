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

export interface LegalInfo {
  user_id?: number
  form_id?: string
  agreement_url?: string
  agreement_hash?: string
  ip_address?: string
  user_agent?: string
}

export interface CreateFormProps {
  title: string
  description: string
  legal?: LegalInfo
}

export interface UpdateFormProps {
  title?: string
  description?: string
}