import i18next from 'i18next'

export const i18n = (lng?: string) => {
  i18next.init({
    lng,
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: {
        translation: {
          time: 'Time',
          emotion: 'Emotion',
          energy: 'Energy',
          list: 'Diary',
          title: 'Emotion diary report',
          report: 'Report',
        },
      },
      ru: {
        translation: {
          time: 'Время',
          emotion: 'Эмоция',
          energy: 'Энергия',
          list: 'Дневник',
          title: 'Отчёт дневника эмоций',
          report: 'Отчёт',
        },
      },
    },
  })

  return i18next.t
}
