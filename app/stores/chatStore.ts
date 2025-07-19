import type { UIMessage } from 'ai'
import { createGlobalState, useStorage } from '@vueuse/core'

const chatStore = createGlobalState(() => {

  const chat = useStorage<UIMessage[]>(
    'keepdotdev-ai-chat',
    [],
    sessionStorage,
  )

  const computedChat = computed(() => chat.value)

  function appendMessages(messages: UIMessage[]) {
    chat.value = [...chat.value, ...messages]
  }
    
  function clearChat() {
    chat.value = []
  }
    
  return {
    chat: computedChat,
    appendMessages,
    clearChat,
  }

})

export default chatStore

