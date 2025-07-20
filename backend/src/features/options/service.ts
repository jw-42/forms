import { formsService } from '@features/forms'
import { ApiError } from '@shared/utils'
import type { CreateOptionsProps, UpdateOptionProps } from './types'
import { questionsService } from '@features/questions'
import optionsRepository from './repository'

class OptionsService {
  async create(form_id: string, current_user_id: number, data: CreateOptionsProps) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsService.getById(form_id, data.question_id, current_user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    } else if (question.form_id !== form_id) {
      throw ApiError.NotFound('Question not found')
    }

    return await optionsRepository.create(data)
  }

  async get(form_id: string, question_id: number, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    const question = await questionsService.getById(form_id, question_id, current_user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    } else if (question.form_id !== form_id) {
      throw ApiError.NotFound('Question not found')
    }

    return await optionsRepository.get(question_id)
  }

  async getById(form_id: string, question_id: number, option_id: number, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    const question = await questionsService.getById(form_id, question_id, current_user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    } else if (question.form_id !== form_id) {
      throw ApiError.NotFound('Question not found')
    }

    const option = await optionsRepository.getById(option_id)

    if (!option) {
      throw ApiError.NotFound('Option not found')
    } else if (option.question_id !== question_id) {
      throw ApiError.NotFound('Option not found')
    }

    return option
  }

  async update(form_id: string, question_id: number, option_id: number, current_user_id: number, data: UpdateOptionProps) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsService.getById(form_id, question_id, current_user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    } else if (question.form_id !== form_id) {
      throw ApiError.NotFound('Question not found')
    }

    return await optionsRepository.update(form_id, question_id, option_id, data)
  }

  async delete(form_id: string, question_id: number, option_id: number, current_user_id: number) {
    const form = await formsService.getById(form_id, current_user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsService.getById(form_id, question_id, current_user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    } else if (question.form_id !== form_id) {
      throw ApiError.NotFound('Question not found')
    }

    return await optionsRepository.deleteById(form_id, question_id, option_id)
  }
}

export default new OptionsService()