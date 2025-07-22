import { ResizePanel } from "@shared/ui"
import { Accordion, Div, Group, Header, Link, MiniInfoCell, NavIdProps, PanelHeaderBack, Paragraph } from "@vkontakte/vkui"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes } from "@shared/model"

export const Help = (props: NavIdProps) => {

  const router = useRouteNavigator()

  const handleBack = () => {
    router.push(routes.forms.overview.path)
  }

  const handleCreateForm = () => {
    router.push(routes.forms.builder.path)
  }

  return(
    <ResizePanel
      title='Помощь'
      before={<PanelHeaderBack onClick={handleBack} />}
      {...props}
    >
      <Group header={
        <Header size='l'>Помощь</Header>
      }>
        <Accordion>
          <Accordion.Summary>
            Как создать анкету?
          </Accordion.Summary>

          <Accordion.Content>
            <Div>
              <Paragraph>
                Чтобы создать анкету, вам нужно нажать на кнопку «<Link onClick={handleCreateForm}>Создать анкету</Link>» в верхнем правом углу экрана.
              </Paragraph>
            </Div>

            <Div>
              <Paragraph>
                Введите название и описание анкеты, укажите ссылку на вашу политику конфиденциальности и подтвердите действие, нажав на кнопку «Создать анкету».
              </Paragraph>
            </Div>
          </Accordion.Content>
        </Accordion>
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