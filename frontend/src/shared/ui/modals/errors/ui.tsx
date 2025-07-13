import { Div, ModalPage, ModalPageContent, ModalPageHeader, NavIdProps } from "@vkontakte/vkui"

interface ErrorModalProps extends NavIdProps {
  title?: string
  message?: string
}

export const ErrorModal = ({ title, message, ...props }: ErrorModalProps) => {
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
        <Div>
          {message}
        </Div>
      </ModalPageContent>
    </ModalPage>
  )
}