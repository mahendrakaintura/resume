<script setup>
import { ref, computed } from 'vue'
import { Link, usePage, router } from '@inertiajs/vue3'
import axios from 'axios'
import EntryModal from '@/Components/Entry/EntryModal.vue'
import ProjectModal from '@/Components/Project/ProjectModal.vue'

const props = defineProps({
  project: Object,
  isMypage: Boolean
})

const emit = defineEmits(['check'])
const page = usePage()

const isFavorite = ref(props.project.is_favorited ?? false)
const showEntryModal = ref(false)
const showProjectModal = ref(false)

const hasEntry = computed(() => props.project.has_entry)

const isNew = computed(() => {
  const diffDays = Math.ceil((new Date() - new Date(props.project.created_at)) / (1000 * 60 * 60 * 24))
  return diffDays <= 14
})

const toggleFavorite = async () => {
  const originalState = isFavorite.value
  try {
    isFavorite.value = !isFavorite.value
    const method = originalState ? 'delete' : 'post'
    await axios[method](route('favorites.store', props.project.id))
  } catch {
    isFavorite.value = originalState
  }
}

const saveScrollPosition = () => {
  if (typeof window !== 'undefined') {
    const position = window.pageYOffset || document.documentElement.scrollTop
    sessionStorage.setItem('lastScrollPosition', position.toString())
  }
}

const handleEntrySubmitted = () => {
  showEntryModal.value = false
  router.reload({
    only: ['projects'],
    onSuccess: () => {
      // Optional: scroll to the top or show a notification
    }
   });
}
</script>

<template>
  <div class="rounded-md border border-gray-300 bg-white p-4 sm:p-6 lg:p-10">
    <div class="p-2 sm:p-3">
      <div class="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        <p v-if="isNew"
          class="rounded-md bg-yellow-500 text-base sm:text-xl w-16 sm:w-20 px-3 sm:px-5 py-1 sm:py-2 text-center">新着
        </p>
        <div v-else class="w-16 sm:w-20"></div>

        <template v-if="isMypage">
          <input type="checkbox" @change="$emit('check', { id: project.id, checked: $event.target.checked })"
            class="h-5 w-5" />
        </template>
        <template v-else-if="page.props.auth.user">
          <button @click="toggleFavorite" :class="isFavorite ? 'bg-yellow-200' : 'bg-gray-300'"
            class="sm:w-auto rounded text-black text-base sm:text-lg font-bold px-3 sm:px-5 py-1 justify-end">
            {{ isFavorite ? 'お気に入り済み' : 'お気に入りへ追加' }}
          </button>
        </template>
      </div>

      <h2 class="mt-3 p-2 text-lg sm:text-xl font-bold break-all">{{ project.title }}</h2>

      <div class="space-y-2 sm:space-y-3 mt-4">
        <p class="text-base sm:text-xl font-bold p-2">
          <span class="block sm:inline">◎ エリア：{{ project.workplace }}</span>
          <span class="block sm:inline sm:ml-4">◎ リモートワーク：{{ project.remote_work_display || '相談' }}</span>
          <span class="block sm:inline sm:ml-4">◎ 国籍：{{ project.is_only_japanese === 1 ? '日本人のみ' : '不問' }}</span>
        </p>
        <p class="text-base sm:text-xl font-bold p-2">■ 月単価：{{ project.display_price }}</p>
        <p class="text-base sm:text-xl font-bold p-2">■ スキル：<span class="break-all">{{ project.skills }}</span></p>
        <div class="text-base sm:text-xl font-bold p-2">
          <p class="mb-1">■ 概要・内容：</p>
          <p class="text-sm sm:text-base font-normal break-all">{{ project.summary }}</p>
        </div>
      </div>
    </div>

    <div
      class="text-center flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
      <template v-if="isMypage">
        <button @click="showProjectModal = true"
          class="w-full sm:w-48 rounded bg-blue-500 hover:bg-blue-400 text-white text-base sm:text-lg font-bold px-4 sm:px-8 py-2">
          詳細
        </button>
      </template>
      <template v-else>
        <Link :href="route('projects.show', project.id)" :preserve-state="true" @click="saveScrollPosition"
          class="w-full sm:w-48 rounded bg-blue-500 hover:bg-blue-400 text-white text-base sm:text-lg font-bold px-4 sm:px-8 py-2">
        詳細
        </Link>
      </template>

      <button @click="showEntryModal = true" :disabled="hasEntry"
        :class="hasEntry ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'"
        class="w-full sm:w-48 rounded text-white text-base sm:text-lg font-bold py-2">
        {{ hasEntry ? 'エントリー済み' : 'エントリー' }}
      </button>
    </div>
  </div>

  <ProjectModal :show="isMypage && showProjectModal" :project="project" @close="showProjectModal = false" />
  <EntryModal :show="showEntryModal" :project-id="project.id" :is-authenticated="$page.props.auth.user !== null"
    @close="showEntryModal = false" @submitted="handleEntrySubmitted" />
</template>