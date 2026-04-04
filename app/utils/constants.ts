import type { Preset } from '~/types'

export const PRESETS: Preset[] = [
  {
    id: 'landing',
    name: 'Лендинг',
    description: '5 экранов, стандарт',
    formData: {
      projectType: 'landing',
      scopeValue: 5,
      complexity: 'standard',
      revisions: 2,
      addons: {
        research: false,
        prototype: false,
        designSystem: false,
        adaptive: true,
        copywriting: false,
        devHandoff: false,
        urgent: false,
      },
    },
  },
  {
    id: 'corporate',
    name: 'Корпоративный сайт',
    description: '12 экранов, стандарт',
    formData: {
      projectType: 'corporate',
      scopeValue: 12,
      complexity: 'standard',
      revisions: 3,
      addons: {
        research: false,
        prototype: false,
        designSystem: false,
        adaptive: true,
        copywriting: false,
        devHandoff: true,
        urgent: false,
      },
    },
  },
  {
    id: 'ecommerce',
    name: 'Интернет-магазин',
    description: '20 экранов, сложно',
    formData: {
      projectType: 'ecommerce',
      scopeValue: 20,
      complexity: 'advanced',
      revisions: 3,
      addons: {
        research: true,
        prototype: true,
        designSystem: false,
        adaptive: true,
        copywriting: false,
        devHandoff: true,
        urgent: false,
      },
    },
  },
  {
    id: 'mobile',
    name: 'Мобильное приложение',
    description: '15 экранов, сложно',
    formData: {
      projectType: 'mobile',
      scopeValue: 15,
      complexity: 'advanced',
      revisions: 3,
      addons: {
        research: true,
        prototype: true,
        designSystem: true,
        adaptive: false,
        copywriting: false,
        devHandoff: true,
        urgent: false,
      },
    },
  },
]
