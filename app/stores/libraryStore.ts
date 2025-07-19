import type { RealtimeChannel } from '@supabase/supabase-js'
import type { File } from '../../shared/types/app'

const libraryStore = defineStore('library', () => {
  const client = useSupabaseClient<Database>()
  const library = useState<Library>('library', () => [])
  const user = useSupabaseUser()
  const realtimeChannel = ref<RealtimeChannel | null>(null)

  const { status, error, execute } = useDollarFetch<AsyncSuccess<{ library: Library }>, DollarFetchError>(
    '/api/library',
    {
      $fetch: {
        method: 'GET',
        headers: useRequestHeaders(['cookie']),
      },
      hooks: {
        onSuccess(data) {
          library.value = data.library
        },
      },
    },
    false,
  )

  const sortedLibrary = computed(() => {
    return [...library.value].sort((folderA, folderB) => {
      if (folderA.starred && !folderB.starred) return -1
      if (!folderA.starred && folderB.starred) return 1
      return new Date(folderB.updated_at).getTime() - new Date(folderA.updated_at).getTime()
    }).map(folder => ({
      ...folder,
      files: [...folder.files].sort((fileA, fileB) => {
        return new Date(fileA.created_at).getTime() - new Date(fileB.created_at).getTime()
      }),
    }))
  })

  function getFolderById(folderId: number) {
    return sortedLibrary.value.find(folder => folder.id === folderId)
  }

  function getFileByFolderIdAndFileId(folderId: number, fileId: number) {
    const folder = getFolderById(folderId)
    if (!folder) return undefined
    return folder.files.find(file => file.id === fileId)
  }

  function realtimeOn() {
    if (!user.value || realtimeChannel.value) return
  
    realtimeChannel.value = client
      .channel('library-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `owner_id=eq.${user.value.id}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'UPDATE': {
              const updatedFolder = payload.new as Folder
              library.value = library.value.map(folder =>
                folder.id === updatedFolder.id
                  ? {
                      ...folder,
                      ...updatedFolder,
                      files: folder.files,
                    }
                  : folder,
              )
              break
            }
            case 'INSERT': {
              const newFolder = payload.new as Folder
              if (!library.value.some(folder => folder.id === newFolder.id)) {
                library.value = [
                  ...library.value,
                  { ...newFolder, files: [] },
                ]
              }
              break
            }
            case 'DELETE': {
              const deletedFolder = payload.old as Folder
              library.value = library.value.filter(
                folder => folder.id !== deletedFolder.id,
              )
              break
            }
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files',
          filter: `owner_id=eq.${user.value.id}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'UPDATE': {
              const updatedFile = payload.new as File
              library.value = library.value.map(folder =>
                folder.id === updatedFile.folder_id
                  ? {
                      ...folder,
                      files: folder.files.map(file =>
                        file.id === updatedFile.id
                          ? { ...file, ...updatedFile }
                          : file,
                      ),
                    }
                  : folder,
              )
              break
            }
            case 'INSERT': {
              const newFile = payload.new as File
              library.value = library.value.map(folder =>
                folder.id === newFile.folder_id
                  ? {
                      ...folder,
                      files: [
                        ...folder.files,
                        newFile,
                      ],
                    }
                  : folder,
              )
              break
            }
            case 'DELETE': {
              const deletedFile = payload.old as File
              library.value = library.value.map(folder =>
                folder.id === deletedFile.folder_id
                  ? {
                      ...folder,
                      files: folder.files.filter(
                        file => file.id !== deletedFile.id,
                      ),
                    }
                  : folder,
              )
              break
            }
          }
        },
      )
      .subscribe()
  }

  function realtimeOff() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  return {
    getLibrary: execute,
    status,
    error,
    folders: sortedLibrary,
    getFolderById,
    getFileByFolderIdAndFileId,
    realtimeOn,
    realtimeOff,
  }
})

export default libraryStore
