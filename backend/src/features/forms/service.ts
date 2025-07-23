import { answersRepository } from '@features/responses'
import { formsRepository, MAX_FORMS_PER_USER, type CreateFormInput, type DataProcessingAgreementInput, type UpdateFormInput } from './index'
import { ApiError } from '@shared/utils'
import { getAgreementHash } from '@shared/utils/get-agreement-hash'
import { ADMINS } from '@shared/config'

class FormsService {
  async create(owner_id: number, data: CreateFormInput, legal_info?: Partial<DataProcessingAgreementInput>) {
    const formsCount = await formsRepository.count(owner_id)

    if (formsCount >= MAX_FORMS_PER_USER) {
      throw ApiError.Conflict('You have reached the maximum number of forms')
    }

    const {
      url: agreement_url,
      hash: agreement_hash
    } = await getAgreementHash('https://bugs-everywhere.ru/data-processing-agreement')

    const legal: DataProcessingAgreementInput = {
      agreement_url,
      agreement_hash,
    }

    return await formsRepository.create(owner_id, data, legal)
  }

  async get(owner_id: number, count: number = 10, offset: number = 0) {
    return await formsRepository.get(owner_id, count, offset)
  }

  async getById(form_id: string, current_user_id: number) {
    const form = await formsRepository.getById(form_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    const answers = await answersRepository.getById(form_id, current_user_id)

    return {
      ...form,
      can_edit: form.owner_id === current_user_id,
      has_answer: !!answers
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

  async getDataProccessingAgreement(form_id: string, current_user_id: number) {
    const form = await formsRepository.getById(form_id)
    const is_admin = ADMINS.includes(current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.owner_id !== current_user_id && !is_admin) {
      throw ApiError.Forbidden()
    }

    return await formsRepository.getDataProccessingAgreement(form_id)
  }

  async getPersonalDataAgreements(form_id: string, current_user_id: number, user_ids?: number[]) {
    const form = await formsRepository.getById(form_id)
    const is_admin = ADMINS.includes(current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.owner_id !== current_user_id && !is_admin) {
      throw ApiError.Forbidden()
    }

    if (user_ids?.length && is_admin) {
      return await formsRepository.getPersonalDataAgreements(form_id, user_ids)
    } else {
      return await formsRepository.getPersonalDataAgreements(form_id, [ current_user_id ])
    }
  }
}

export default new FormsService()