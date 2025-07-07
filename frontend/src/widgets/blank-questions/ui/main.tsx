import { useQuestions } from "@entities/question/hooks"
import { QuestionItem } from "@entities/question"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Separator, Spacing } from "@vkontakte/vkui"
import React, { useState } from "react"
import { QuestionBuilder } from "./builder"
import { QuestionFooter } from "./footer"
import { List } from "@shared/ui"
import { useForm } from "@entities/form/hooks"
import { useGetAnswersByUserId } from "@entities/answer"
import { RootState } from "@app/store"
import { useSelector } from "react-redux"

export const BlankQuestions = () => {

  const params = useParams<'id'>()

  const { data: form } = useForm(params?.id)
  const { data: questions } = useQuestions(params?.id)

  const { userId } = useSelector((state: RootState) => state.config)
  const { data: userAnswers } = useGetAnswersByUserId(params?.id as string, userId as number)

  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerChange = (questionId: string, value: string) => {
    if (!form?.has_answer) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }))
    }
  }

  return (
    <React.Fragment>
      <List
        after={form?.can_edit && <QuestionBuilder/>}
        afterCondition={questions && questions.length < 5}
      >
        {questions?.map((question) => (
          <QuestionItem
            {...question}
            value={
              userAnswers?.items.find(answer => answer.question_id === question.id)?.value || 
              answers[question.id] || 
              ''
            }
            onChange={(value) => handleAnswerChange(question.id, value)}
            readOnly={form?.has_answer}
          />
        ))}
      </List>

      <Spacing>
        <Separator/>
      </Spacing>

      <QuestionFooter currentAnswers={answers} />
    </React.Fragment>
  )
}