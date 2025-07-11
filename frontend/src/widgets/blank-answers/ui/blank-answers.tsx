import { useGetAllAnswers, useGetAnswersByUserId, useResetAnswers } from "@entities/answer"
import { Div, Select, Avatar, CustomSelectOption, Spacing, Separator, Button } from "@vkontakte/vkui"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import React from "react"
import bridge from "@vkontakte/vk-bridge"
import { QuestionItem } from "@entities/question"
import { List } from "@shared/ui"

export const BlankAnswers = () => {

  const params = useParams<'id'>()

  const [selectedUser, setSelectedUser] = React.useState<number | undefined>(undefined)

  const { data: list } = useGetAllAnswers(params?.id as string)
  const { data: answers } = useGetAnswersByUserId(params?.id as string, selectedUser)
  const { mutate: resetAnswers } = useResetAnswers()

  const [users, setUsers] = React.useState<{ value: number, label: string, avatar?: string }[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(Number(e.target.value))
  }

  React.useEffect(() => {
    if (!list || list.length === 0) return

    const user_ids = list.map((answer) => answer.user_id).join(',')
    
    bridge.send('VKWebAppGetUserInfo', { user_ids })
      .then((data: any) => {
        if (Array.isArray(data?.result)) {
          const userList = data?.result?.map((user: any) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
            avatar: user.photo_100
          }))

          setUsers(userList)
          setSelectedUser(userList[0]?.value)
        } else {
          const user = {
            value: data?.id,
            label: `${data?.first_name} ${data?.last_name}`,
            avatar: data?.photo_100
          }

          setUsers([user])
          setSelectedUser(user.value)
        }
      })
  }, [ list ])

  const renderOption = ({option, ...restProps}: any) => (
    <CustomSelectOption
      {...restProps}
      key={option.value}
      before={<Avatar size={24} src={option.avatar} />}
    />
  )

  const handleResetAnswers = () => {
    resetAnswers({
      formId: params?.id as string,
      userId: selectedUser as number
    })
  }

  return (
    <React.Fragment>
      <Div>
        <Select 
          options={users}
          value={selectedUser}
          placeholder='Выберите пользователя'
          onChange={handleChange}
          renderOption={renderOption}
        />
      </Div>

      <Spacing>
        <Separator/>
      </Spacing>

      <List afterCondition after={
        <Button
          size="l"
          stretched
          mode='tertiary'
          appearance='negative'
          onClick={handleResetAnswers}
          disabled={!selectedUser}
        >
          Удалить ответы
        </Button>
      }>
        {answers?.items?.map((item, index) => (
          <QuestionItem
            key={index}
            form_id={params?.id as string}
            type={item.question.type}
            text={item.question.text}
            id={item.question.id}
            value={item.value}
            readOnly
            options={item.question.options || []}
          />
        ))}
      </List>
    </React.Fragment>
  )
}