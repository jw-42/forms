/**
 * Свойства варианта
 */
export interface OptionProps {
  /**
   * ID варианта ответа
   */
  id: string

  /**
   * ID вопроса, к которому относится вариант ответа
   */
  question_id: string

  /**
   * Текст варианта ответа
   */
  text: string

  /**
   * Порядок варианта ответа в списке
   */
  order?: number

  /**
   * Дата создания варианта ответа
   */
  created_at: string

  /**
   * Дата обновления варианта ответа
   */
  updated_at: string
}

/**
 * Свойства для создания варианта
 */
export interface CreateOptionProps {
  text: string
  order?: number
}

/**
 * Свойства для обновления варианта
 */
export interface UpdateOptionProps {
  text?: string
  order?: number
}

/**
 * Свойства для создания множественных вариантов
 */
export interface CreateMultipleOptionsProps {
  options: Array<{
    id?: string
    text: string
    order?: number
  }>
}

/**
 * Свойства компомента варианта
 */
export interface OptionItemProps {
  /**
   * Режим отображения компонента
   */
  mode?: 'default' | 'draggable'

  /**
   * Значение варианта ответа (текст или option_id)
   */
  value: string

  /**
   * ID вопроса
   */
  question_id: string

  /**
   * Обработчик изменения значения для режима default
   */
  onChange: (options: Record<string, string>) => void
  
  /**
   * Обработчик удаления варианта для режима draggable
   */
  onRemove?: () => void

  /**
   * Функция для обновления списка вариантов
   */
  updateListFn?: () => void
}