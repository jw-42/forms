import { ResizePanel } from "@shared/ui"
import { Accordion, Div, Group, Header, Link, MiniInfoCell, NavIdProps, PanelHeaderBack, Paragraph, Search, Spacing, Separator } from "@vkontakte/vkui"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes } from "@shared/model"
import React from "react"

interface AccordionItemProps {
  /** Заголовок вопроса */
  title: string;
  /** Массив абзацев, каждый из которых состоит из частей: текст и/или ссылки */
  content: AccordionParagraph[];
}

/** Абзац внутри AccordionItem */
export interface AccordionParagraph {
  parts: AccordionParagraphPart[];
}

/** Часть абзаца: либо текст, либо ссылка */
export type AccordionParagraphPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; onClick?: () => void; href?: string };

export const Help = (props: NavIdProps) => {
  const router = useRouteNavigator()

  const handleBack = () => {
    router.push(routes.forms.overview.path)
  }

  const handleCreateForm = () => {
    router.push(routes.forms.builder.path)
  }

  // Новый массив вопросов и ответов
  const faq: AccordionItemProps[] = [
    {
      title: 'Как создать анкету?',
      content: [
        {
          parts: [
            { type: 'text', text: 'Чтобы создать анкету, вам нужно нажать на кнопку «' },
            { type: 'link', text: 'Создать анкету', onClick: handleCreateForm },
            { type: 'text', text: '» в верхнем правом углу экрана.' },
          ],
        },
        {
          parts: [
            { type: 'text', text: 'Введите название и описание анкеты, укажите ссылку на вашу политику конфиденциальности и подтвердите действие, нажав на кнопку.' },
          ],
        },
      ],
    },
    {
      title: 'Почему не удаётся создать анкету?',
      content: [
        {
          parts: [
            { type: 'text', text: 'Проверьте, нет ли у вас анкеты с таким названием. Дело в том, что оно должно быть уникальным.' },
          ],
        }
      ]
    },
    {
      title: 'Почему исчезла кнопка для создания вопросов?',
      content: [
        {
          parts: [
            { type: 'text', text: 'Сейчас в одну анкету можно добавить не более 5-ти вопросов. Если их пять или больше, добавление новых вопросов будет ограничено.' },
          ],
        },
      ],
    },
    {
      title: 'Зачем нужно указывать политику конфиденциальности?',
      content: [
        {
          parts: [
            { type: 'text', text: 'Это требование российского законодательства. Так пользователи смогут ознакомиться с тем, как вы собираетесь обрабатывать их персональные данные и дать своё согласие.' },
          ],
        },
        {
          parts: [
            { type: 'text', text: 'Если вы не указываете ссылку, применяется ' },
            { type: 'link', text: 'типовая политика конфиденциальности', href: 'https://bugs-everywhere.ru/typical-data-proccessing-agreement' },
            { type: 'text', text: '.' },
          ],
        },
      ]
    },
    {
      title: 'Как удалить свои ответы?',
      content: [
        {
          parts: [
            { type: 'text', text: 'Отменить отправку и удалить свои ответы нельзя.' },
          ],
        },
        {
          parts: [
            { type: 'text', text: 'Вы можете связаться с автором анкеты, нажав «Подробная информация» под названием анкеты. ' },
            { type: 'text', text: 'Если это будет необходимо, он сможет удалить ваши ответы, а вы — заполнить анкету заново.' },
          ]
        }
      ]
    }
  ]

  // Состояние поиска
  const [search, setSearch] = React.useState("");

  // Фильтрация по названию (игнорируем регистр и пробелы)
  const filteredFaq = faq.filter(item =>
    item.title.replace(/\s+/g, '').toLowerCase().includes(search.replace(/\s+/g, '').toLowerCase())
  );

  // Рендер части абзаца
  const renderPart = (part: AccordionParagraphPart, idx: number) => {
    if (part.type === 'text') return part.text
    if (part.type === 'link') return (
      <Link key={idx} onClick={part.onClick} href={part.href} target={part.href ? '_blank' : undefined}>{part.text}</Link>
    )
    return null
  }

  // Рендер абзаца
  const renderParagraph = (paragraph: AccordionParagraph, idx: number) => (
    <Div key={idx}>
      <Paragraph>
        {paragraph.parts.map(renderPart)}
      </Paragraph>
    </Div>
  )

  return(
    <ResizePanel
      title='Помощь'
      before={<PanelHeaderBack onClick={handleBack} />}
      {...props}
    >
      <Group header={<Header size='l'>Помощь</Header>}>
        <Search
          placeholder='Введите свой вопрос'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filteredFaq.map((item, idx) => (
          <React.Fragment key={idx}>
            <Accordion>
              <Accordion.Summary>{item.title}</Accordion.Summary>
              <Accordion.Content>
                {item.content.map(renderParagraph)}
              </Accordion.Content>
            </Accordion>
            {idx !== filteredFaq.length - 1 && (
              <Spacing>
                <Separator />
              </Spacing>
            )}
          </React.Fragment>
        ))}
      </Group>

      <Group header={
        <Header size='l'>Правовая информация</Header>
      }>
        <MiniInfoCell
          textWrap='full'
          mode='base'
        >
          <Link
            target='_blank'
            href='https://bugs-everywhere.ru/user-agreement'
            style={{ color: 'var(--vkui--color_text_secondary)' }}
          >
            Условия использования
          </Link>
        </MiniInfoCell>

        <MiniInfoCell
          textWrap='full'
          mode='base'
        >
          <Link
            target='_blank'
            href='https://bugs-everywhere.ru/privacy-policy'
            style={{ color: 'var(--vkui--color_text_secondary)' }}
          >
            Политика конфиденциальности
          </Link>
        </MiniInfoCell>

        <MiniInfoCell
          textWrap='full'
          mode='base'
        >
          <Link
            target='_blank'
            href='https://bugs-everywhere.ru/data-processing-agreement'
            style={{ color: 'var(--vkui--color_text_secondary)' }}
          >
            Оферта на поручение обработки персональных данных
          </Link>
        </MiniInfoCell>

        <MiniInfoCell
          textWrap='full'
          mode='base'
        >
          <Link
            target='_blank'
            href='https://bugs-everywhere.ru/typical-data-proccessing-agreement'
            style={{ color: 'var(--vkui--color_text_secondary)' }}
          >
            Типовое соглашение на обработку персональных данных
          </Link>
        </MiniInfoCell>
      </Group>
    </ResizePanel>
  )
}