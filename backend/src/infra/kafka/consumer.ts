import { Kafka } from 'kafkajs'
// @ts-ignore
import { VK } from 'vk-io'
import { getForm } from '../../features/forms/repository'

const kafka = new Kafka({
  clientId: 'forms-cloud-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'form-answers-group' })

const vk = new VK({
  token: process.env.VK_GROUP_TOKEN || 'your_VK_GROUP_TOKEN_here'
})

async function sendVkNotify(owner_id: number, message: string) {
  // Здесь отправка сообщения владельцу формы через VK
  await vk.api.messages.send({
    user_id: owner_id,
    random_id: Date.now(),
    message
  })
}

async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'form-answers', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return
      const event = JSON.parse(message.value.toString())
      const { form_id, user_id, answer } = event
      const form = await getForm(form_id)
      if (form?.notifications && form.owner_id) {
        await sendVkNotify(form.owner_id, `Новая заявка на вашу форму #${form_id}`)
      }
    }
  })
}

run().catch(console.error) 