import { Telegram } from 'telegraf'
import { InputFile } from 'telegraf/typings/core/types/typegram'

const telegram = new Telegram(String(process.env.BOT_TOKEN))

export const sendFile = (id: string | number, inputFile: InputFile) =>
  telegram.sendDocument(id, inputFile)
