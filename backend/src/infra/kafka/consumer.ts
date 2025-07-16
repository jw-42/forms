import { Kafka } from 'kafkajs'
// @ts-ignore
import { VK } from 'vk-io'
import { getForm } from '../../features/forms/repository'
import { getPrisma } from '@infra/database'

const kafka = new Kafka({
  clientId: 'forms-cloud-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'form-answers-group' })

const vk = new VK({
  token: process.env.VK_GROUP_TOKEN || ''
})

async function sendVkNotify(owner_id: number, message: string) {
  // Здесь отправка сообщения владельцу формы через VK
  await vk.api.messages.send({
    user_id: owner_id,
    random_id: Date.now(),
    message
  })
}

async function getUserName(user_id: number): Promise<{first_name: string, last_name: string}> {
  try {
    const user = await vk.api.users.get({ user_ids: [user_id], name_case: 'Acc' })
    if (user && user[0]) {
      return { first_name: user[0].first_name, last_name: user[0].last_name }
    }
  } catch {}
  return { first_name: '', last_name: '' }
}

async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'form-answers', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return
      const event = JSON.parse(message.value.toString())
      const { form_id, user_id } = event
      const form = await getForm(form_id)
      if (form?.notifications && form.owner_id) {
        const prisma = getPrisma()
        const form_title = form.title
        const user = await getUserName(user_id)
        const msg = `📥 Новый ответ от [id${user_id}|${user.first_name} ${user.last_name}] на анкету «${form_title}»:\nhttps://vk.com/app53866259#/form/${form_id}/answers`
        await sendVkNotify(form.owner_id, msg)
      }
    }
  })
}

run().catch(console.error) 