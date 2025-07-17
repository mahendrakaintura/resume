<script setup>
import { Head, usePage } from '@inertiajs/vue3'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import ProjectCard from '@/Components/Project/ProjectCard.vue'
import LanguageCombobox from '@/Components/Project/LanguageCombobox.vue'

const props = defineProps({
    projects: Array,
    hasMore: Boolean,
    filters: Object,
    filterOptions: Object
})

const page = usePage()
const isLoading = ref(false)
const projectsList = ref([])
const hasMoreProjects = ref(true)
const scrollTimeout = ref(null)
const isSearching = ref(false)

const updateProjectEntryStatus = ({ projectId }) => {
  const project = projectsList.value.find(p => p.id === projectId)
  if (project) {
    project.has_entry = true
  }
}

const selectedArea = ref(props.filters.area || '')
const selectedPrice = ref(props.filters.display_price || '')
const selectedStart = ref(props.filters.start || '')
const selectedSort = ref(props.filters.sort || 'latest')
const languageFilter = ref({
    text: props.filters.skill_search || '',
    option: props.filters.language || ''
})

const handleSearch = () => {
    isSearching.value = true
    projectsList.value = []

    const params = {
        area: selectedArea.value,
        display_price: selectedPrice.value,
        start: selectedStart.value,
        sort: selectedSort.value
    }

    if (languageFilter.value.text) params.skill_search = languageFilter.value.text
    if (languageFilter.value.option) params.language = languageFilter.value.option

    localStorage.setItem('projectFilters', JSON.stringify(params))

    router.get('/', params, {
        preserveState: true,
        preserveScroll: false,
        onSuccess: (response) => {
            projectsList.value = response.props.projects
            hasMoreProjects.value = response.props.hasMore
            isSearching.value = false
        }
    })
}

const clearFilters = () => {
    selectedArea.value = ''
    selectedPrice.value = ''
    selectedStart.value = ''
    selectedSort.value = 'latest'
    languageFilter.value = {
        text: '',
        option: ''
    }
    localStorage.removeItem('projectFilters')
    handleSearch()
}

const loadMore = () => {
    if (isLoading.value || !hasMoreProjects.value) return

    isLoading.value = true
    const lastId = projectsList.value[projectsList.value.length - 1]?.id
    const params = {
        area: selectedArea.value,
        display_price: selectedPrice.value,
        start: selectedStart.value,
        sort: selectedSort.value,
        last_id: lastId
    }

    if (languageFilter.value.text) params.skill_search = languageFilter.value.text
    if (languageFilter.value.option) params.language = languageFilter.value.option

    router.get('/', params, {
        preserveState: true,
        preserveScroll: true,
        only: ['projects', 'hasMore'],
        onSuccess: (page) => {
            projectsList.value = [...projectsList.value, ...page.props.projects]
            hasMoreProjects.value = page.props.hasMore
            isLoading.value = false
        }
    })
}

const handleScroll = () => {
    if (isLoading.value || !hasMoreProjects.value) return

    const scrollPosition = window.innerHeight + window.scrollY
    const bottomPosition = document.documentElement.offsetHeight - 500

    if (scrollPosition >= bottomPosition) {
        if (scrollTimeout.value) clearTimeout(scrollTimeout.value)
        scrollTimeout.value = setTimeout(loadMore, 100)
    }
}

const handleSort = (sortValue) => {
    selectedSort.value = sortValue
    handleSearch()
}

onMounted(() => {
    const savedFilters = localStorage.getItem('projectFilters')
    if (savedFilters) {
        const filters = JSON.parse(savedFilters)
        selectedArea.value = filters.area || ''
        selectedPrice.value = filters.display_price || ''
        selectedStart.value = filters.start || ''
        selectedSort.value = filters.sort || 'latest'
        languageFilter.value.text = filters.skill_search || ''
        languageFilter.value.option = filters.language || ''
        handleSearch()
    } else {
        projectsList.value = props.projects
        hasMoreProjects.value = props.hasMore
        selectedSort.value = 'latest'
    }
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout.value) clearTimeout(scrollTimeout.value)
})

watch(() => page.props.alert?.message, (message) => {
    if (message) window.alert(message)
})
</script>

<template>

    <Head title="案件一覧" />
    <AppLayout>
        <template #main>
            <div class="front-content w-full p-4 md:p-6 lg:p-10">
                <div class="block lg:flex w-full">
                    <div class="w-full lg:w-1/3 mb-6 lg:mb-0">
                        <div
                            class="rounded-md bg-white p-3 lg:sticky top-[calc(var(--header-height)+1rem)] transition-all duration-200">
                            <div class="space-y-4">
                                <div class="flex flex-col sm:flex-row lg:flex-col">
                                    <div class="w-full space-y-4">

                                        <div class="flex flex-col sm:flex-row items-start sm:items-center">
                                            <label
                                                class="w-full sm:w-24 text-left sm:text-right mb-2 sm:mb-0 sm:mr-4">エリア</label>
                                            <select v-model="selectedArea"
                                                class="w-full rounded-md border-gray-300 focus:border-blue-500 text-sm py-2 px-3"
                                                :disabled="isSearching">
                                                <option value="">選択してください</option>
                                                <option v-for="(label, value) in filterOptions.areas" :key="value"
                                                    :value="value">
                                                    {{ label }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="flex flex-col sm:flex-row items-start sm:items-center">
                                            <label
                                                class="w-full sm:w-24 text-left sm:text-right mb-2 sm:mb-0 sm:mr-4">希望単価</label>
                                            <select v-model="selectedPrice"
                                                class="w-full rounded-md border-gray-300 focus:border-blue-500 text-sm py-2 px-3"
                                                :disabled="isSearching">
                                                <option value="">選択してください</option>
                                                <option v-for="(label, value) in filterOptions.prices" :key="value"
                                                    :value="value">
                                                    {{ label }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="flex flex-col sm:flex-row items-start sm:items-center">
                                            <label
                                                class="w-full sm:w-24 text-left sm:text-right mb-2 sm:mb-0 sm:mr-4">言語</label>
                                            <LanguageCombobox v-model="languageFilter" :is-searching="isSearching"
                                                :filter-options="filterOptions" />
                                        </div>

                                        <div class="flex flex-col sm:flex-row items-start sm:items-center">
                                            <label
                                                class="w-full sm:w-24 text-left sm:text-right mb-2 sm:mb-0 sm:mr-4">稼働時期</label>
                                            <select v-model="selectedStart"
                                                class="w-full rounded-md border-gray-300 focus:border-blue-500 text-sm py-2 px-3"
                                                :disabled="isSearching">
                                                <option value="">選択してください</option>
                                                <option v-for="(label, value) in filterOptions.starts" :key="value"
                                                    :value="value">
                                                    {{ label }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-6">
                                    <button type="button" @click="handleSearch"
                                        class="w-full rounded bg-blue-500 hover:bg-blue-400 text-white text-lg font-bold py-2"
                                        :disabled="isSearching">
                                        <span v-if="isSearching">検索中...</span>
                                        <span v-else>検索</span>
                                    </button>
                                    <button type="button" @click="clearFilters"
                                        class="w-full rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-lg font-bold py-2 mt-2"
                                        :disabled="isSearching">
                                        条件をクリア
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-full lg:w-2/3 lg:pl-5">
                        <div class="flex justify-end mb-4 space-x-2">
                            <button @click="handleSort('latest')" class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded"
                                :class="{
                                    'bg-blue-500 text-white': selectedSort === 'latest',
                                    'bg-gray-200 hover:bg-gray-300': selectedSort !== 'latest'
                                }">
                                新着順
                            </button>
                            <button @click="handleSort('display_price_high')"
                                class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded" :class="{
                                    'bg-blue-500 text-white': selectedSort === 'display_price_high',
                                    'bg-gray-200 hover:bg-gray-300': selectedSort !== 'display_price_high'
                                }">
                                単価の高い順
                            </button>
                        </div>

                        <div v-if="projectsList.length === 0 && !isLoading"
                            class="bg-white rounded-lg p-4 sm:p-6 text-center">
                            <p class="text-gray-600">検索条件に該当する案件が見つかりませんでした。</p>
                            <p class="text-gray-600 mt-2">条件を変更して再度検索してください。</p>
                        </div>
                        <div v-else class="space-y-4 sm:space-y-5">
                            <div v-for="project in projectsList" :key="project.id">
                                <ProjectCard :project="project" @entry-submitted="updateProjectEntryStatus" />
                            </div>
                        </div>
                        <div v-if="isLoading" class="text-center py-8">
                            <div
                                class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent">
                            </div>
                        </div>
                        <div v-if="!hasMore && projectsList.length > 0" class="text-center py-8 text-gray-500">
                            全ての案件を表示しました
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
</template>

<style>
:root {
    --header-height: 88px;
}
</style>