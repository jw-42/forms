import { getForms, getForm, createForm, updateForm, deleteForm } from './repository'
import type { CreateFormInput, UpdateFormInput } from './types'
import { getPrisma } from '@infra/database'

class FormsService {
  async getAllForms(owner_id: number, count: number = 10, offset: number = 0) {
    return getForms(owner_id, count, offset)
  }

  async getForm(form_id: string) {
    return getForm(form_id)
  }

  async createForm(owner_id: number, data: CreateFormInput) {
    return createForm(owner_id, data)
  }

  async updateForm(form_id: string, owner_id: number, data: UpdateFormInput) {
    return updateForm(form_id, owner_id, data)
  }

  async deleteForm(form_id: string, owner_id: number) {
    return deleteForm(form_id, owner_id)
  }

  async getFormWithDetails(form_id: string, user_id: number) {
    const prisma = getPrisma()
    const form = await getForm(form_id)
    
    if (!form) return null
    
    const answer = await prisma.answersGroup.findFirst({
      where: { form_id, user_id },
      select: { id: true }
    })
    
    return {
      ...form,
      can_edit: form.owner_id === user_id,
      has_answer: !!answer
    }
  }
}

export default new FormsService()
