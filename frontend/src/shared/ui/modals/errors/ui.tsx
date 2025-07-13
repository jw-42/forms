import { ModalPage, ModalPageContent, ModalPageHeader, NavIdProps, Placeholder } from "@vkontakte/vkui"

interface ErrorModalProps extends NavIdProps {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export const ErrorModal = ({ title, message, icon, ...props }: ErrorModalProps) => {
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
        <Placeholder icon={icon}>
          {message}
        </Placeholder>
      </ModalPageContent>
    </ModalPage>
  )
}