import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'forms-cloud-backend',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
})

const producer = kafka.producer()

export async function sendFormAnswerEvent(event: object) {
  await producer.connect()
  await producer.send({
    topic: 'form-answers',
    messages: [{ value: JSON.stringify(event) }]
  })
  await producer.disconnect()
} 