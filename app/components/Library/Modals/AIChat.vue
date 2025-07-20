<template>

  <UModal
    :dismissible="false"
    :close="{ onClick: () => emit('close', false), disabled: chat.status === 'streaming' || chat.status === 'submitted' }"
    :ui="{
      content: 'max-w-2xl',
      description: 'flex items-center gap-1',
      footer: 'flex flex-col gap-1',
      body: 'ai-chat-modal-body',
    }"
  >

    <template #description>

      <UIcon
        name="lucide:bot"
        class="text-base"
      />

      <span>Chat with AI</span>
    </template>

    <template #title>

      <div class="flex gap-1 items-center">
        <Logo />
        <span class="font-mono text-base">AI</span>
      </div>

    </template>

    <template #body>

      <UAlert
        color="neutral"
        variant="soft"
        title="AI Assistant for Your Docs"
        description="Answers are based on your saved documents and code. Unless you ask otherwise, the AI uses only your personal knowledge base. Responses may not always be fully accurate—please use your judgement."
      />

      <USeparator />

      <TransitionGroup
        tag="section"
        class="flex flex-col flex-1 gap-4 items-center pt-4 w-full"
        enter-active-class="transition-all duration-700"
        leave-active-class="transition-all duration-700"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(message, messageIndex) in chat.messages"
          :key="message.id || messageIndex"
          :class="[
            'flex flex-col gap-2 max-w-3xl w-full break-all',
            message.role === 'user' ? 'items-end' : 'items-start',
          ]"
        >
          <div
            v-if="message.role === 'user'"
            class="self-end p-2 rounded-full bg-elevated"
          >

            <UAvatar
              v-if="user"
              :src="user.user_metadata.avatar_url"
              :alt="user.user_metadata.full_name"
              size="xs"
            />

          </div>

          <div
            v-if="message.role === 'assistant'"
            class="self-start p-2 rounded-full bg-elevated size-10"
          >
            <UIcon
              name="lucide:bot"
              class="size-6"
            />
            
          </div>

          <template
            v-for="(part, partIndex) in message.parts"
            :key="`${message.id}-${part.type}-${partIndex}`"
          >
          
            <div
              v-if="message.role === 'user' && part.type === 'text'"
              class="overflow-x-auto p-2 max-h-40 rounded-lg bg-elevated"
            >
              <span>{{ part.text }}</span>
            </div>

            <div
              v-if="message.role === 'assistant' && part.type === 'text'"
              class="flex flex-col gap-2 p-2 w-full rounded-lg bg-elevated"
            >

              <MdPreview
                id="keepdotdev-ai-chat-preview"
                :model-value="part.text"
                theme="dark"
                preview-theme="default"
                class="flex-auto rounded-md !bg-transparent"
                code-theme="github"
                language="en-US"
                show-code-row-number
                :md-heading-id="(text) => mdHeadingId(text)"
              />

            </div>
          </template>

        </div>
      </TransitionGroup>

      <UAlert
        v-if="chat.status === 'error'"
        color="error"
        variant="soft"
        title="An Error Occurred"
        icon="lucide:circle-x"
        orientation="horizontal"
        :ui="{ root: 'mt-2' }"
        :actions="[
          { label: 'Retry',
            onClick: () => chat.regenerate(),
            variant: 'ghost',
            icon: 'lucide:refresh-ccw',
          },
        ]"
      />

      <UButton
        v-if="chat.status === 'ready' && chat.messages.length > 0"
        color="neutral"
        variant="outline"
        label="Clear"
        icon="lucide:trash"
        size="sm"
        :ui="{
          base: 'mt-2',
        }"
        @click="clearAllChatReference"
      />

    </template>

    <template #footer>

      <UProgress
        v-show="chat.status === 'streaming' || chat.status === 'submitted'"
        v-model="isStreaming"
        size="2xs"
        animation="elastic"
      />

      <UForm
        id="ai-chat-form"
        :state
        :schema
        class="w-full"
        @submit="sendPrompt"
      >
        <UFormField name="message">

          <div class="flex gap-2 items-end p-1 w-full rounded-md border border-default relative">

            <UTextarea
              v-model="state.message"
              color="neutral"
              variant="ghost"
              autoresize
              :ui="{
                root: 'w-full',
              }"
              placeholder="Enter message"
              size="lg"
              :rows="1"
              name="message"
            />

            <UButton
              type="submit"
              form="ai-chat-form"
              color="neutral"
              variant="soft"
              :ui="{
                base: 'absolute right-1',
              }"
              :disabled="state.message === '' || chat.status === 'streaming' || chat.status === 'submitted'"
              icon="lucide:send"
            />

          </div>

        </UFormField>

      </UForm>

    </template>

  </UModal>

</template>

<script lang="ts" setup>
import z from 'zod'
import { Chat } from '@ai-sdk/vue'
import { MdPreview } from 'md-editor-v3'

defineShortcuts({
  meta_enter: {
    usingInput: 'message',
    handler: () => sendPrompt(),
  },
})

const aiChatModalBodyRef = ref<Element | null>(null)

const isStreaming = ref(null)
const user = useSupabaseUser()

const chatStoreRef = chatStore()

const chat = new Chat({
  messages: chatStoreRef.chat.value,
  maxSteps: 5,
  onFinish() {
    chatStoreRef.appendMessages(chat.messages.slice(-2))
  },
})

function clearAllChatReference() {
  chat.messages = []
  chatStoreRef.clearChat()
}

const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  message: z.string(),
})

const state = reactive<z.output<typeof schema>>({
  message: '',
})

function sendPrompt() {
  chat.sendMessage(
    { text: state.message },
    {
      headers: useRequestHeaders(['cookie']),
    },
  )

  state.message = ''
}

function scrollToBottom() {
  nextTick(() => {
    const element = aiChatModalBodyRef.value
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  })
}

watch(
  () => chat.messages.length,
  () => scrollToBottom(),
)

onMounted(() => {

  nextTick(() => {

    const element = document.querySelector('.ai-chat-modal-body')

    if (element) {
      aiChatModalBodyRef.value = element

      scrollToBottom()
    }

  })

})
</script>
