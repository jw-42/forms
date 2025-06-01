import { useCreateForm, useForm, useUpdateForm } from '@entities/form'
import { routes } from '@shared/model/routes'
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Button, Div, FormItem, FormLayoutGroup, Input, PanelSpinner, Textarea } from '@vkontakte/vkui'
import React from 'react'

export const BlankForm = () => {

  const params = useParams<'id'>()
  const id = params?.id

  const router = useRouteNavigator()
  const {
    data: form,
    isPending: isFormLoading,
    isSuccess: isForm
  } = useForm(id)

  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')

  const {
    mutate: createForm,
    isPending: isCreating,
    isSuccess: isCreated,
    data: createdForm,
  } = useCreateForm()

  const {
    mutate: updateForm,
    isPending: isUpdating,
    isSuccess: isUpdated,
    data: updatedForm,
  } = useUpdateForm()

  const isPending = isCreating || isUpdating
  const handleSubmit = () => {
    if (!title || !description) return

    const formData = { title, description }
    id ? updateForm({ id, data: formData }) : createForm(formData)
  }

  React.useEffect(() => {
    if (isCreated) {
      router.push(routes.forms.blank.path, { id: createdForm?.id })
    } else if (isUpdated) {
      router.push(routes.forms.blank.path, { id: updatedForm?.id })
    }
  }, [isCreated, isUpdated])

  React.useEffect(() => {
    if (isForm) {
      setTitle(form?.title || '')
      setDescription(form?.description || '')
    }
  }, [isForm])

  if (id && isFormLoading) return <PanelSpinner size='l' />

  return (
    <FormLayoutGroup onSubmit={handleSubmit}>
      <FormItem top='Название'>
        <Input
          name='title'
          placeholder='Введите название'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={isPending}
        />
      </FormItem>

      <FormItem top='Описание'>
        <Textarea
          rows={3}
          maxLength={255}
          name='description'
          placeholder='Раскажите о том, зачем нужна эта анкета'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          disabled={isPending}
        />
      </FormItem>

      <Div>
        <Button
          size='l'
          stretched
          onClick={handleSubmit}
          disabled={isPending || !title || !description}
        >
          {id ? 'Обновить анкету' : 'Создать анкету'}
        </Button>
      </Div>
    </FormLayoutGroup>
  )
}