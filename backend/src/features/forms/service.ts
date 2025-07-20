import { formsRepository, MAX_FORMS_PER_USER, type CreateFormInput, type UpdateFormInput } from './index'
import { ApiError } from '@shared/utils'

class FormsService {
  async create(owner_id: number, data: CreateFormInput) {
    const formsCount = await formsRepository.count(owner_id)

    if (formsCount >= MAX_FORMS_PER_USER) {
      throw ApiError.Conflict('You have reached the maximum number of forms')
    }

    return await formsRepository.create(owner_id, data)
  }

  async get(owner_id: number, count: number = 10, offset: number = 0) {
    return await formsRepository.get(owner_id, count, offset)
  }

  async getById(form_id: string, current_user_id: number) {
    const form = await formsRepository.getById(form_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    // TODO: get answers for current form

    return {
      ...form,
      can_edit: form.owner_id === current_user_id,
    }
  }

  async update(form_id: string, owner_id: number, data: UpdateFormInput) {
    const form = await formsRepository.getById(form_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.owner_id !== owner_id) {
      throw ApiError.Forbidden()
    }

    return await formsRepository.update(form_id, data)
  }

  async delete(form_id: string, owner_id: number) {
    const form = await formsRepository.getById(form_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.owner_id !== owner_id) {
      throw ApiError.Forbidden()
    }

    return await formsRepository.delete(form_id)
  }
}

export default new FormsService()