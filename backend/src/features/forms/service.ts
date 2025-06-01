import { getForms, getForm, createForm, updateForm, deleteForm } from './repository'
import type { CreateFormInput, UpdateFormInput } from './types'

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
}

export default new FormsService()
