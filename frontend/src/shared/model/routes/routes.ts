import {
  createHashRouter,
  createModal,
  createPanel,
  createTab,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router'

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
} as const

export enum VIEW {
  FORMS = 'forms',
  ANSWERS = 'answers',
  SETTINGS = 'settings',
  HELP = 'help',
}

export enum FORMS_PAGES {
  OVERVIEW = 'overview',
  BUILDER = 'builder',
  BLANK = 'blank',
}

export enum FORMS_TABS {
  DEFAULT = 'default',
  FAVORITES = 'favorites',
}

export enum BLANK_TABS {
  QUESTIONS = 'questions',
  ANSWERS = 'answers',
  OPTIONS = 'options',
}

export enum ANSWERS_PAGES {
  OVERVIEW = 'overview',
}

export enum SETTINGS_PAGES {
  OVERVIEW = 'overview',
}

export enum HELP_PAGES {
  OVERVIEW = 'overview',
}

export enum MODALS {
  BLANK_DETAILS = 'blank-details',
  BLANK_BUILDER = 'blank-builder',
  QUESTION_CREATION = 'question-creation',
  QUESTION_BUILDER = 'question-builder',
  OPTIONS_BUILDER = 'options-builder',
}

export const routes = RoutesConfig.create([
  createView(VIEW.FORMS, [
    createPanel(FORMS_PAGES.OVERVIEW, '/', [
      createTab(FORMS_TABS.DEFAULT, '/'),
      createTab(FORMS_TABS.FAVORITES, '/favorites')
    ]),
    createPanel(FORMS_PAGES.BUILDER, '/form/create', []),
    createPanel(FORMS_PAGES.BLANK, '/form/:id', [
      createTab(BLANK_TABS.QUESTIONS, '/form/:id', [
        createModal(MODALS.QUESTION_CREATION, '/form/:id/c/:type', [ 'id', 'type' ] as const),
        createModal(MODALS.QUESTION_BUILDER, '/form/:id/q/:qid', [ 'id', 'qid' ] as const),
        createModal(MODALS.OPTIONS_BUILDER, '/form/:id/q/:qid/options', [ 'id', 'qid' ] as const),
      ], [ 'id' ] as const),
      createTab(BLANK_TABS.ANSWERS, '/form/:id/answers', [], [ 'id' ] as const),
      createTab(BLANK_TABS.OPTIONS, '/form/:id/options', [], [ 'id' ] as const),
    ], [ 'id' ] as const),
  ]),

  createView(VIEW.ANSWERS, [
    createPanel(ANSWERS_PAGES.OVERVIEW, '/answers', []),
  ]),

  createView(VIEW.SETTINGS, [
    createPanel(SETTINGS_PAGES.OVERVIEW, '/settings', []),
  ]),

  createView(VIEW.HELP, [
    createPanel(HELP_PAGES.OVERVIEW, '/help', []),
  ]),
])

export const router = createHashRouter(routes.getRoutes())
