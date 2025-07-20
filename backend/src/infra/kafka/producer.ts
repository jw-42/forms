import { Kafka } from 'kafkajs'
import type { NewAnswerEvent, NewFormEvent, NewUserEvent } from './types'

const kafka = new Kafka({
  clientId: 'forms-api',
  brokers: ['kafka:9092']
})

const producer = kafka.producer()

export async function sendNewUserEvent(event: NewUserEvent) {
  await producer.connect()
  await producer.send({
    topic: 'user-creation',
    messages: [{ value: JSON.stringify(event) }]
  })
  await producer.disconnect()
}

export async function sendNewFormEvent(event: NewFormEvent) {
  await producer.connect()
  await producer.send({
    topic: 'form-creation',
    messages: [{ value: JSON.stringify(event) }]
  })
  await producer.disconnect()
}

export async function sendNewAnswerEvent(event: NewAnswerEvent) {
  await producer.connect()
  await producer.send({
    topic: 'form-answers',
    messages: [{ value: JSON.stringify(event) }]
  })
  await producer.disconnect()
}

export default producer