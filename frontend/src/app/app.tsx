import { View, SplitLayout, SplitCol, Epic, usePlatform, Platform, PanelHeader, ScreenSpinner, ModalRoot } from '@vkontakte/vkui'
import { useActiveVkuiLocation, useGetPanelForView, usePopout, useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useDispatch, useSelector } from 'react-redux'
import { setInit } from './store/config-slice'
import { useAuth } from '@shared/api/auth'
import bridge from '@vkontakte/vk-bridge'
import { RootState } from './store'
import React from 'react'
import { VIEW, FORMS_PAGES, EpicTabbar, MODALS, FormDetails, BlankBuilderModal, QuestionBuilder, ANSWERS_PAGES, OptionsBuilder, ErrorModalWrapper, SETTINGS_PAGES, HELP_PAGES } from '@shared/index'
import { Blank, BlankBuilder, Forms, Sidebar, Settings, Help } from '@pages/index'
import { Answers } from '@pages/answers'

export const App = () => {
  const popout = usePopout()
  const dispatch = useDispatch()
  const router = useRouteNavigator()
  const { refetch: refreshToken } = useAuth()

  const { view: activeStory = VIEW.FORMS, modal: activeModal } = useActiveVkuiLocation()
  const activePanel = useGetPanelForView(activeStory) || ''

  const platform = usePlatform()
  const isVKCOM = platform === Platform.VKCOM

  const { isInit, accessToken } = useSelector((state: RootState) => state.config)

  const modals = (
    <ModalRoot activeModal={activeModal} onClose={() => router.hideModal()}>
      <FormDetails id={MODALS.BLANK_DETAILS} />
      <BlankBuilderModal id={MODALS.BLANK_BUILDER} />
      <QuestionBuilder id={MODALS.QUESTION_CREATION} />
      <QuestionBuilder id={MODALS.QUESTION_BUILDER} />
      <OptionsBuilder id={MODALS.OPTIONS_BUILDER} />
      <ErrorModalWrapper />
    </ModalRoot>
  )

  React.useEffect(() => {    
    bridge.send('VKWebAppInit')
      .then(() => {
        dispatch(setInit(true))
        return refreshToken()
      })
      .catch((error) => {
        console.error('Initialization error:', error)      
      })
  }, [dispatch, refreshToken])

  if (!isInit || !accessToken) {
    return <ScreenSpinner state="loading" />
  }

  return (
    <SplitLayout
      center
      header={!isVKCOM && <PanelHeader delimiter="none" />}
    >
      <SplitCol
        autoSpaced
        maxWidth={600}
        style={{ marginLeft: 0 }}
      >
        <Epic
          activeStory={activeStory}
          tabbar={!isVKCOM ? <EpicTabbar /> : undefined}
        >
          <View id={VIEW.FORMS} activePanel={activePanel}>
            <Forms id={FORMS_PAGES.OVERVIEW} />
            <BlankBuilder id={FORMS_PAGES.BUILDER} />
            <Blank id={FORMS_PAGES.BLANK} />
          </View>

          <View id={VIEW.ANSWERS} activePanel={activePanel}>
            <Answers id={ANSWERS_PAGES.OVERVIEW} />
          </View>

          <View id={VIEW.SETTINGS} activePanel={activePanel}>
            <Settings id={SETTINGS_PAGES.OVERVIEW} />
          </View>

          <View id={VIEW.HELP} activePanel={activePanel}>
            <Help id={HELP_PAGES.OVERVIEW} />
          </View>
        </Epic>
      </SplitCol>

      {isVKCOM && (
        <SplitCol fixed width={345} maxWidth={345}>
          <Sidebar/>
        </SplitCol>
      )}

      {modals}
      {popout}
    </SplitLayout>
  )
}
