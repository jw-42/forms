import { useForm } from "@entities/form"
import { Icon24MoreHorizontal } from "@vkontakte/icons"
import { ActionSheet, Cell, Group, IconButton, Link, Snackbar, Title } from "@vkontakte/vkui"
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { MODALS, routes } from "@shared/model"
import React, { useRef } from "react"
import { FormActionsSheet } from "@shared/ui"

export const BlankCover = () => {

  const ref = useRef(null)
  const params = useParams<'id'>()
  const router = useRouteNavigator()

  const {
    data: form,
    isError: isErrorGetForm
  } = useForm(params?.id)

  const handleOpenDetails = () => router.showPopout(
    <ActionSheet
      onClose={() => router.hidePopout()}
      placement='bottom-end'
      toggleRef={ref}
    >
      <FormActionsSheet formId={form?.id} canEdit={true} />
    </ActionSheet>
  )

  React.useEffect(() => {
    if (isErrorGetForm) {
      router.push(routes.forms.overview.path)
      router.showPopout(
        <Snackbar
          onClose={() => router.hidePopout()}
          duration={3000}
        >
          Анкета не найдена
        </Snackbar>
      )
    }
  }, [ isErrorGetForm ])

  return (
    <Group>
      <Cell
        subtitle={
          <Link
            style={{
              color: 'var(--vkui--color_text_secondary)',
            }}
            onClick={() => {
              if (form?.id) {
                router.showModal(MODALS.BLANK_DETAILS)
              }
            }}
          >
            Подробная информация
          </Link>
        }
        after={
          <IconButton getRootRef={ref} onClick={handleOpenDetails}>
            <Icon24MoreHorizontal style={{ color: 'var(--vkui--color_icon_secondary)' }} />
          </IconButton>
        }
      >
        <Title level='3'>{form?.title || 'Без названия'}</Title>
      </Cell>
    </Group>
  )
}