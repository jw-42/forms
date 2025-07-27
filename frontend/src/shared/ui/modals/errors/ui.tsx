import { ModalPage, ModalPageContent, ModalPageHeader, NavIdProps, Placeholder } from "@vkontakte/vkui"

interface ErrorModalProps extends NavIdProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  placeholderTitle?: string
  placeholderAction?: React.ReactNode
}

export const ErrorModal = ({ title, message, icon, placeholderTitle, placeholderAction, ...props }: ErrorModalProps) => {
  return(
    <ModalPage
      header={
        <ModalPageHeader>
          {title}
        </ModalPageHeader>
      }
      {...props}
    >
      <ModalPageContent>
        <Placeholder icon={icon || undefined} title={placeholderTitle} action={placeholderAction}>
          {message}
        </Placeholder>
      </ModalPageContent>
    </ModalPage>
  )
}