import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { MODALS } from '@shared/model'
import { ErrorModal } from './ui'
import { errorService } from '@shared/api/config'

export const ErrorModalWrapper = () => {
  const router = useRouteNavigator()
  const [errorTitle, setErrorTitle] = React.useState('Неизвестная ошибка')
  const [errorMessage, setErrorMessage] = React.useState('Произошла неизвестная ошибка. Попробуйте позже.')

  React.useEffect(() => {
    const showErrorModal = (title: string, message: string) => {
      setErrorTitle(title)
      setErrorMessage(message)
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
    />
  )
} 