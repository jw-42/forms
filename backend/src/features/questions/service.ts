import type { CreateQuestionProps, UpdateQuestionProps } from './types'
import { MAX_QUESTIONS_PER_FORM, questionsRepository } from './index'
import { formsService } from '@features/forms'
import { ApiError } from '@shared/utils'

class QuestionsService {
  async create(user_id: number, data: CreateQuestionProps) {
    const form = await formsService.getById(data.form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const questions = await questionsRepository.getByFormId(data.form_id)

    if (questions.length >= MAX_QUESTIONS_PER_FORM) {
      throw ApiError.BadRequest('Maximum questions limit reached')
    }

    return await questionsRepository.create(data)
  }

  async getByFormId(form_id: string, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    return await questionsRepository.getByFormId(form_id)
  }

  async getById(form_id: string, question_id: number, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    return await questionsRepository.getById(form_id, question_id)
  }

  async update(form_id: string, question_id: number, user_id: number, data: UpdateQuestionProps) {
    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsRepository.getById(form_id, question_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    }

    return await questionsRepository.update(form_id, question_id, data)
  }

  async deleteById(form_id: string, question_id: number, user_id: number) {
    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsRepository.getById(form_id, question_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    }

    return await questionsRepository.deleteById(form_id, question_id)
  }
}

export default new QuestionsService()