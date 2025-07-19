<template>
  <nav class="sticky top-0 z-10 p-4 w-full bg-default">
  
    <ul class="flex justify-between items-center mx-auto w-full md:justify-end max-w-8xl">

      <li>

        <USlideover
          v-model:open="isSlideoverOpen"
          side="left"
          :ui="{
            content: 'max-w-xs',
            body: 'flex flex-col gap-4',
            description: 'font-mono',
          }"
          :description="`Hello! @${user?.user_metadata.user_name}`"
        >

          <template #title>
            <Logo />
          </template>

          <template #body>

            <div class="flex flex-col gap-4">
              <UButton
                label="New Folder"
                icon="lucide:plus"
                variant="soft"
                square
                exact
                @click="() => {
                  isSlideoverOpen = false
                  nextTick(() => newAndEditFolderModal.open())
                }"
              />

              <UButton
                label="Search"
                icon="lucide:search"
                variant="ghost"
                square
              />

              <UButton
                label="Ask AI"
                icon="lucide:bot"
                variant="ghost"
                square
                @click="aiChatModal.open()"
              />

            </div>

            <div class="flex flex-col gap-4 pt-4 border-t border-default">
              <UButton
                label="Library"
                icon="lucide:library"
                variant="ghost"
                square
                to="/library"
                active-variant="soft"
                exact
                @click="isSlideoverOpen = false"
              />
            </div>
          
          </template>

          <template #footer>
            <UButton
              label="Logout"
              icon="lucide:log-out"
              variant="ghost"
              color="error"
              square
              class="grow-1"
              @click="signOutModal.open()"
            />

            <ColorModeButton />
          </template>


          <UButton
            class="md:hidden"
            icon="lucide:panel-left-open"
            variant="ghost"
          />
        </USlideover>
      </li>

      
      <li>
        <UAvatar
          v-if="user"
          :src="user.user_metadata.avatar_url"
          :alt="user.user_metadata.full_name"
          size="md"
        />

        <USkeleton
          v-else-if="!user"
          class="w-9 h-9 rounded-full"
        />
      </li>

    </ul>
  
  </nav>
  
</template>


<script lang="ts" setup>
import { LazyLibraryModalsAIChat, LazyLibraryModalsNewAndEditFolder, LazyLibraryModalsSignOut } from '#components'

const isSlideoverOpen = ref(false)
const user = useSupabaseUser()
const overlay = useOverlay()
const signOutModal = overlay.create(LazyLibraryModalsSignOut)
const newAndEditFolderModal = overlay.create(LazyLibraryModalsNewAndEditFolder)
const aiChatModal = overlay.create(LazyLibraryModalsAIChat)
</script>
 
