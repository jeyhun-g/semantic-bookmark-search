
import { MessageSender, Message } from './types'

export class MessageHandler {
  constructor() {

  }

  async onMessage(message: Message, sender: MessageSender, sendResponse: (response: unknown) => void): Promise<boolean | undefined> {
    return true
  }
}