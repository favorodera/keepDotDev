<template>

  <UModal
    :dismissible="false"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{
      content: 'max-w-2xl',
    }"
    title="Find Something in Your Library"
    description="Quickly search folders and files by name or description"
  >


    <template #body>

      <UCommandPalette
        placeholder="Search by name or description..."
        :fuse="{ fuseOptions: { includeMatches: true } }"
        :groups="[
          { id: 'folders', label: 'Folders', items: folders },
          { id: 'files', label: 'Files', items: files },
        ]"
      />

    </template>


  </UModal>

</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()

const library = libraryStore()

const folders = computed(() => {

  return library.folders.map((folder) => {

    return {
      id: folder.id,
      label: folder.name,
      suffix: folder.description,
      icon: 'lucide:folder',
      to: { name: 'library-folder', params: { folder: folder.id } },
      onSelect: () => emit('close', false),
    }

  })

})

const files = computed(() => {
  return library.folders.flatMap((folder) => {

    return folder.files.map((file) => {

      return {
        id: file.id,
        label: file.name,
        prefix: `${library.getFolderById(file.folder_id)?.name} >`,
        icon: 'lucide:file-text',
        to: { name: 'read-folder-file', params: { folder: file.folder_id, file: file.id } },
        onSelect: () => emit('close', false),
      }

    })

  })
})


</script>
