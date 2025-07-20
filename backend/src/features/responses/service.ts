import { formsService } from '@features/forms'
import answersRepository from './repository'
import type { SubmitAnswers } from './types'
import { ApiError } from '@shared/utils'

class AnswersService {
  async submit(data: SubmitAnswers) {
    const form = await formsService.getById(data.form_id, data.user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    return await answersRepository.submit(data)
  }

  async get(form_id: string, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    return await answersRepository.get(form_id)
  }

  async getById(form_id: string, answers_group_id: string, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true && current_user_id !== form.owner_id) {
      throw ApiError.Forbidden()
    }

    return await answersRepository.getById(answers_group_id)
  }

  async deleteByUserId(form_id: string, user_id: number, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true && current_user_id !== user_id) {
      throw ApiError.Forbidden()
    }

    return await answersRepository.deleteByUserId(form_id, user_id)
  }
}

export default new AnswersService()