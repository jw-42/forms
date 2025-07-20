import { Kafka } from 'kafkajs'
import { Keyboard, VK } from 'vk-io'
import vkService from './vk-service'
import type { NewUserEvent, NewFormEvent, NewAnswerEvent } from './types'

const kafka = new Kafka({
  clientId: 'notify-service',
  brokers: ['kafka:9092']
})

const vk = new VK({
  token: Bun.env.VK_GROUP_TOKEN as string
})

const consumer = kafka.consumer({ groupId: 'notify-service' })

async function handleNewAnswerEvent(event: NewAnswerEvent) {
  const { form_id, title, owner_id, user_id, notifications } = event

  if (!notifications) return

  const userInfo = await vkService.getUserInfo([user_id], { fields: ['sex'] })
  const userName = `${userInfo[0].first_name} ${userInfo[0].last_name}`

  const msg = `📥 [id${user_id}|${userName}] ${userInfo[0].sex === 1 ? 'ответила' : 'ответил'} на анкету «${title}»`

  const builder = Keyboard.builder().inline()
    .applicationButton({
      label: 'Посмотреть ответы',
      appId: 53866259,
      hash: `/form/${form_id}/answers`
    })

  await vkService.sendMessage([owner_id], msg, undefined, builder)
}

async function handleNewUserEvent(event: NewUserEvent) {
  const { user_id } = event
  
  const userInfo = await vkService.getUserInfo([user_id], { fields: ['sex'] })
  const userName = `${userInfo[0].first_name} ${userInfo[0].last_name}`
  
  const msg = `👤 [id${user_id}|${userName}] (ID: ${user_id}) ${userInfo[0].sex === 1 ? 'присоединилась' : 'присоединился'}`

  const builder = Keyboard.builder().inline()
    .urlButton({
      label: 'Открыть профиль',
      url: `https://vk.com/id${user_id}`
    })

  await vkService.sendMessage(vkService.admins, msg, undefined, builder)
}

async function handleNewFormEvent(event: NewFormEvent) {
  const { form_id, title, owner_id } = event
  
  const userInfo = await vkService.getUserInfo([owner_id], { fields: ['sex'] })
  const userName = `${userInfo[0].first_name} ${userInfo[0].last_name}`

  const msg = `📝 [id${owner_id}|${userName}] ${userInfo[0].sex === 1 ? 'создала' : 'создал'} новую анкету «${title}»`

  const builder = Keyboard.builder().inline()
    .applicationButton({
      label: 'Посмотреть',
      appId: 53866259,
      hash: `/form/${form_id}`
    })
  
  await vkService.sendMessage([owner_id], msg, undefined, builder)
}

async function main() {
  await consumer.connect()
  
  // Подписываемся на все топики
  await consumer.subscribe({ topic: 'form-answers', fromBeginning: false })
  await consumer.subscribe({ topic: 'user-creation', fromBeginning: false })
  await consumer.subscribe({ topic: 'form-creation', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return

      const event = JSON.parse(message.value.toString())
      
      try {
        switch (topic) {
          case 'form-answers':
            await handleNewAnswerEvent(event)
            break
          case 'user-creation':
            await handleNewUserEvent(event)
            break
          case 'form-creation':
            await handleNewFormEvent(event)
            break
          default:
            console.log(`Неизвестный топик: ${topic}`)
        }
      } catch (error) {
        console.error(`Ошибка обработки сообщения из топика ${topic}:`, error)
      }
    }
  })
}

main().catch(console.error)