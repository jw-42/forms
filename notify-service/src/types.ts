/**
 * Объект события о регистрации нового пользователя
 */
export interface NewUserEvent {
  /**
   * ID пользователя
   */
  user_id: number
}

/**
 * Объект события о создании новой формы
 */
export interface NewFormEvent {
  /**
   * ID формы
   */
  form_id: string

  /**
   * Название формы
   */
  title: string

  /**
   * ID владельца формы
   */
  owner_id: number
}

/**
 * Объект события об отправке нового ответа на форму
 */
export interface NewAnswerEvent {
  /**
   * ID формы
   */
  form_id: string

  /**
   * Название формы
   */
  title: string

  /**
   * ID владельца формы
   */
  owner_id: number

  /**
   * ID пользователя, который ответил на форму
   */
  user_id: number

  /**
   * Флаг, указывающий, включены ли уведомления
   */
  notifications: boolean

  /**
   * Массив ответов на вопросы
   */
  answers: {
    question_id: number
    value: string
  }[]
} 