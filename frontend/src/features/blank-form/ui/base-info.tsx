import { useCreateForm, useForm, useUpdateForm } from '@entities/form'
import { Privacy } from './index'
import { isValidPrivacyUrl } from '@shared/lib/privacy-url-validator'
import { routes } from '@shared/model/routes'
import { Icon20Stars } from '@vkontakte/icons'
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Button, Div, Footnote, FormItem, FormLayoutGroup, IconButton, Input, Link, PanelSpinner, Separator, Spacing, Textarea, Tooltip } from '@vkontakte/vkui'
import React from 'react'

export const BaseInfo = () => {

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
  const [privacyUrl, setPrivacyUrl] = React.useState('')

  const isPrivacyUrlValid = isValidPrivacyUrl(privacyUrl)

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

    id
      ? updateForm({
        id, 
        data: { title, description }
      })
      : createForm({
          title,
          description,
          privacy_policy: privacyUrl.length > 0 ? privacyUrl : undefined,
        })
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
      <FormItem
        top={
          <FormItem.Top>
            <FormItem.TopLabel>Название</FormItem.TopLabel>

            <FormItem.TopAside>
              {title.length || 0}/64
            </FormItem.TopAside>
          </FormItem.Top>
        }
        bottom={(title.length < 10 && title.length > 0)
          ? `Минимальное количество символов — 10 (ещё ${10 - title.length})`
          : undefined
        }
      >
        <Input
          name='title'
          placeholder='Введите название'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={isPending}
          maxLength={64}
        />
      </FormItem>

      <FormItem
        top={
          <FormItem.Top>
            <FormItem.TopLabel>Описание</FormItem.TopLabel>

            <FormItem.TopAside>
              {description.length || 0}/256
            </FormItem.TopAside>
          </FormItem.Top>
        }
        bottom={(description.length < 10 && description.length > 0)
          ? `Минимальное количество символов — 10 (ещё ${10 - description.length})`
          : undefined
        }
      >
        <Textarea
          rows={3}
          maxLength={256}
          name='description'
          placeholder='Раскажите о том, зачем нужна эта анкета'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          disabled={isPending}
          after={
            <Tooltip
              description='Сгенерировать описание'
              placement='top-end'
            >
              <IconButton>
                <Icon20Stars/>
              </IconButton>
            </Tooltip>
          }
          afterAlign='start'
        />
      </FormItem>

      {(!id) && (
        <>
          <Spacing>
            <Separator/>
          </Spacing>

          <Privacy value={privacyUrl} onChange={setPrivacyUrl} />
        </>
      )}

      <Spacing>
        <Separator/>
      </Spacing>

      <Div>
        <Button
          size='l'
          stretched
          onClick={handleSubmit}
          disabled={isPending || !title || !description || (!id && !isPrivacyUrlValid)}
        >
          {id ? 'Обновить анкету' : 'Создать анкету'}
        </Button>

        <Spacing size={6} />

        {(!id) && <Footnote style={{ color: 'var(--vkui--color_text_secondary)', textAlign: 'center' }}>
          Создавая анкету, вы подтверждаете, что выступаете оператором персональных данных в соответствии с 152-ФЗ и принимаете <Link target='_blank' href='https://bugs-everywhere.ru/data-processing-agreement'>публичную оферту</Link>.
        </Footnote>}
      </Div>
    </FormLayoutGroup>
  )
}