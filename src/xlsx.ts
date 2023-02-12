import XLSX from 'xlsx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/ru'

import { Rows, UserState } from './types'
import { i18n } from './i18n'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

const divideByDays = (stack: UserState[]) =>
  stack.reduce((prev: Record<string, UserState[]>, cur) => {
    const day = dayjs(cur.timestamp).tz(cur.timezone).format('YYYY-MM-DD')
    prev[day] ??= []
    prev[day].push(cur)

    return prev
  }, {})

const getXLSX = (data: UserState[], language = 'en') => {
  const t = i18n(language)
  dayjs.locale(language)
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

    mergedCells.push(XLSX.utils.decode_range(`A${countCells}:B${countCells}`))

    states.forEach(({ timestamp, emotion, energy, timezone }) => {
      maxEmotionWidth = Math.max(emotion.length, maxEmotionWidth)

      rows.push([
        {
          v: dayjs(timestamp)
            .minute(dayjs().tz(timezone).utcOffset())
            .valueOf(),
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

  return {
    source: XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer,
    filename: `${t('report')}_${dayjs().format('ll')}.xlsx`,
  }
}

export default getXLSX
