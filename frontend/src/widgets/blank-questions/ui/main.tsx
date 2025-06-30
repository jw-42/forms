import { useQuestions } from "@entities/question/hooks"
import { QuestionItem } from "@entities/question"
import { useParams } from "@vkontakte/vk-mini-apps-router"
import { Separator, Spacing } from "@vkontakte/vkui"
import React, { useState } from "react"
import { QuestionBuilder } from "./builder"
import { QuestionFooter } from "./footer"
import { List } from "@shared/ui"

export const BlankQuestions = () => {

  const params = useParams<'id'>()

  const { data: questions } = useQuestions(params?.id)

  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  return (
    <React.Fragment>
      <List
        after={<QuestionBuilder/>}
        afterCondition={questions && questions.length < 5}
      >
        {questions?.map((question) => (
          <QuestionItem
            {...question}
            value={answers[question.id] || ''}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        ))}
      </List>

      <Spacing>
        <Separator/>
      </Spacing>

      <QuestionFooter formId={params?.id} answers={answers} questions={questions} />
    </React.Fragment>
  )
}