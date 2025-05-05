

export interface MessageSender {
  documentId?: string
  documentLifecycle?: string
  frameId?: number
  id?: string
  nativeApplication?: string
  origin?: string
  tab?: unknown
  tlsChannelId?: string
  url?: string
} 

export type SendMessageListener = <M>(message: M, sender: MessageSender, sendResponse: () => void) => boolean | undefined