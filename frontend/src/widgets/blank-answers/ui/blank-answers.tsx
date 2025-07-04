import { AnswerItem, useAnswersByForm, useAnswersGroup, useDeleteAnswersGroup } from "@entities/answer"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Button, Div, Placeholder, Select, Separator, Spacing } from "@vkontakte/vkui"
import React, { useEffect, useState } from "react"

export const BlankAnswers = () => {

  const params = useParams<'id'>()

  const [answersGroupId, setAnswersGroupId] = useState<string | undefined>(undefined)

  const { data: list } = useAnswersByForm(params?.id)
  const { data: answersGroup } = useAnswersGroup(params?.id, answersGroupId)
  const deleteAnswersGroup = useDeleteAnswersGroup()

  useEffect(() => {
    if (list?.[0]) {
      setAnswersGroupId(list[0].id)
    }
  }, [list])

  const handleDeleteAnswers = () => {
    if (answersGroupId && params?.id) {
      deleteAnswersGroup.mutate({
        formId: params.id,
        answersGroupId: answersGroupId
      }, {
        onSuccess: () => {
          // Reset to first available answer group or undefined if none left
          if (list && list.length > 1) {
            const currentIndex = list.findIndex(item => item.id === answersGroupId)
            const nextIndex = currentIndex === 0 ? 1 : currentIndex - 1
            setAnswersGroupId(list[nextIndex]?.id)
          } else {
            setAnswersGroupId(undefined)
          }
        }
      })
    }
  }

  return (
    <>
      <Div>
        <Select 
          options={
            list?.map((answer) => ({
              label: 'Анонимный пользователь',
              value: answer.id
            })) || []
          }
          value={answersGroupId || ''}
          onChange={(e) => setAnswersGroupId(e.currentTarget.value)}
          placeholder="Выберите пользователя"
        />
      </Div>

      {(answersGroup && answersGroup?.items.length > 0) ? (
        <React.Fragment>
          <Spacing>
            <Separator />
          </Spacing>

          {answersGroup?.items.map((answer, index) => (
            <React.Fragment key={index}>
              <AnswerItem {...answer} form_id={params?.id as string} />

              {(index !== answersGroup.items.length - 1) && (
                <Spacing>
                  <Separator />
                </Spacing>
              )}
            </React.Fragment>
          ))}

          <Spacing>
            <Separator/>
          </Spacing>

          <Button
            size='l'
            mode='tertiary'
            appearance='negative'
            stretched
            onClick={handleDeleteAnswers}
            loading={deleteAnswersGroup.isPending}
          >
            Удалить ответы пользователя
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Spacing>
            <Separator/>
          </Spacing>

          <Placeholder>
            Информация об ответах не найдена
          </Placeholder>
        </React.Fragment>
      )}
    </>
  )
}