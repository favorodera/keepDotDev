<template>

  <UModal
    :dismissible="false"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{
      content: 'max-w-2xl',
    }"
    description="Chat with AI"
  >

    <template #title>

      <div class="flex gap-1 items-center">
        <Logo />
        <span class="font-mono text-base">AI</span>
      </div>
    
    </template>

    <template #body>
      
      <div
        v-for="(message, parentIndex) in chat.messages"
        :key="message.id ? message.id : parentIndex"
      >
        {{ message.role === "user" ? "User: " : "AI: " }}
        <div
          v-for="(part, index) in message.parts"
          :key="`${message.id}-${part.type}-${index}`"
        >
          <div
            v-if="part.type === 'text'"
            v-dompurify-html="markdown.render(part.text)"
            class="prose"
            @click="copyCodeBlock"
          />
        </div>
      </div>

    </template>

    <template #footer>

      <UForm
        id="ai-chat-form"
        :state
        :schema
        class="w-full"
        @submit="sendPrompt"
      >
        <UFormField name="message">

          <div class="flex gap-2 items-end p-1 w-full rounded-md border border-default">

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
            />

            <UButton
              type="submit"
              form="ai-chat-form"
              color="neutral"
              variant="soft"
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

const { markdown, copyCodeBlock } = handleMarkdown()

const chat = new Chat({})
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
      body: {
        
      },
    },
  )
  state.message = ''
}
</script>
