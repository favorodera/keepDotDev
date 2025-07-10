<template>
  <nav class="sticky -top-1 z-10 p-4 w-full bg-default">
  
    <ul class="flex justify-between items-center mx-auto w-full md:justify-end max-w-8xl">

      <li>

        <UButton
          class="md:hidden"
          icon="lucide:panel-left-open"
          variant="ghost"
          @click="toggle()"
        />
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
const user = useSupabaseUser()

const { toggle } = useSideBar()
</script>
 
