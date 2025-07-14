import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { MODALS } from '@shared/model'
import { ErrorModal } from './ui'
import { errorService } from '@shared/api/config'

export const ErrorModalWrapper = () => {
  const router = useRouteNavigator()
  const [errorTitle, setErrorTitle] = React.useState('Неизвестная ошибка')
  const [errorMessage, setErrorMessage] = React.useState('Произошла неизвестная ошибка. Попробуйте позже.')
  const [errorIcon, setErrorIcon] = React.useState<React.ReactNode>(undefined)

  React.useEffect(() => {
    const showErrorModal = (title: string, message: string, icon?: any) => {
      setErrorTitle(title)
      setErrorMessage(message)
      // Если icon - это компонент (функция), создаем JSX элемент
      const iconElement = icon && typeof icon === 'function' ? React.createElement(icon) : icon
      setErrorIcon(iconElement)
      router.showModal(MODALS.ERROR)
    }

    errorService.setErrorModal(showErrorModal)

    return () => {
      errorService.setErrorModal(undefined)
    }
  }, [router])

  return (
    <ErrorModal
      id={MODALS.ERROR}
      title={errorTitle}
      message={errorMessage}
      icon={errorIcon}
    />
  )
} 