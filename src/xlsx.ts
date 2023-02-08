import XLSX from 'xlsx'
import dayjs from 'dayjs'

import { Rows, UserState } from './types'
import { i18n } from './i18n'

const divideByDays = (stack: UserState[]) =>
  stack.reduce((prev: Record<string, UserState[]>, cur) => {
    const day = dayjs(cur.timestamp).format('YYYY-MM-DD')
    prev[day] ??= []
    prev[day].push(cur)

    return prev
  }, {})

const getXLSX = (data: UserState[], language?: string) => {
  const t = i18n(language)

  const rows: Rows = [
    [t('time') as string, t('emotion') as string, t('energy') as string],
  ]
  let maxEmotionWidth = 10
  const mergedCells: XLSX.Range[] = []
  let countCells = 2

  Object.entries(divideByDays(data)).forEach(([day, states]) => {
    rows.push([
      {
        v: day,
        t: 'd',
        z: language === 'en' ? 'dddd, MMMM D, YYYY' : 'dddd, D MMMM, YYYY',
        cellNF: true,
      },
    ])

    mergedCells.push(XLSX.utils.decode_range(`A${countCells}:C${countCells}`))

    states.forEach(({ timestamp, emotion, energy }) => {
      maxEmotionWidth = Math.max(emotion.length, maxEmotionWidth)

      rows.push([
        {
          v: timestamp,
          t: 'd',
          z: language === 'en' ? 'hh:mm:ss AM/PM' : 'hh:mm:ss',
          cellNF: true,
        },
        emotion,
        energy,
      ])
      countCells++
    })
    countCells++
  })

  const worksheet = XLSX.utils.aoa_to_sheet(rows)

  worksheet['!cols'] = [{ wch: 15 }, { wch: maxEmotionWidth }]
  worksheet['!merges'] = mergedCells
  const workbook = XLSX.utils.book_new()

  if (!workbook.Props) workbook.Props = {}
  workbook.Props.Title = t('title') as string
  workbook.Props.Author = 'Emotion diary'

  XLSX.utils.book_append_sheet(workbook, worksheet, t('list') as string)

  return XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' })
}

export default getXLSX
