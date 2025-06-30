import { getForms, getForm, createForm, updateForm, deleteForm } from './repository'
import type { CreateFormInput, UpdateFormInput } from './types'
import { hasUserAnsweredForm } from '@features/answers/service'
import { getPrisma } from '@infra/database'

class FormsService {
  async getAllForms(owner_id: string, count: number = 10, offset: number = 0) {
    return getForms(owner_id, count, offset)
  }

  async getForm(form_id: string) {
    return getForm(form_id)
  }

  async createForm(owner_id: string, data: CreateFormInput) {
    return createForm(owner_id, data)
  }

  async updateForm(form_id: string, owner_id: string, data: UpdateFormInput) {
    return updateForm(form_id, owner_id, data)
  }

  async deleteForm(form_id: string, owner_id: string) {
    return deleteForm(form_id, owner_id)
  }

  async getFormWithAnswerStatus(form_id: string, user_id: string) {
    const form = await getForm(form_id)
    if (!form) return null
    
    const is_answered = await hasUserAnsweredForm(form_id, user_id)
    
    // Get user info to check vk_user_id
    const prisma = getPrisma()
    const currentUser = await prisma.user.findUnique({
      where: { id: user_id },
      select: { vk_user_id: true }
    })
    
    const formOwner = await prisma.user.findUnique({
      where: { id: form.owner_id },
      select: { vk_user_id: true }
    })
    
    const can_edit = currentUser?.vk_user_id === formOwner?.vk_user_id
    
    return {
      ...form,
      is_answered,
      can_edit
    }
  }
}

export default new FormsService()
