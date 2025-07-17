<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import EntryCard from '@/Components/Entry/EntryCard.vue';

const props = defineProps({
    entries: {
        type: Array,
        default: () => []
    }
})

const showAllDetails = ref(false)
const searchQuery = ref('')

const showErrorAlert = () => {
    window.alert('エントリーの取り消しに失敗しました。');
}

const toggleAllDetails = () => {
    showAllDetails.value = !showAllDetails.value
}

const filteredEntries = computed(() => {
    if (!searchQuery.value) return props.entries
    
    const query = searchQuery.value.toLowerCase()
    return props.entries.filter(entry => 
        entry.project_title.toLowerCase().includes(query) ||
        (entry.project_skills && entry.project_skills.toLowerCase().includes(query)) ||
        (entry.project_workplace && entry.project_workplace.toLowerCase().includes(query))
    )
})

const entryStats = computed(() => {
    const total = props.entries.length
    const applications = props.entries.filter(e => e.status_id <= 4).length
    const offers = props.entries.filter(e => e.status_id > 4).length
    const cancelled = props.entries.filter(e => e.status_id === 2).length
    
    return { total, applications, offers, cancelled }
})
</script>

<template>
    <Head title="応募履歴" />
    <AppLayout>
        <template #main>
            <div class="py-12">
                <div class="max-w-5xl mx-auto px-6">
                    <div class="mb-6">
                        <h1 class="text-2xl font-bold text-gray-900">応募履歴</h1>
                        <p class="text-gray-600 mt-2">あなたが応募した案件の履歴と詳細情報を確認できます。</p>
                    </div>
                    
                    <div v-if="entries.length === 0" class="bg-white rounded-lg p-8 text-center shadow-sm">
                        <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">応募履歴がありません</h3>
                        <p class="text-gray-600 mb-4">まだ案件に応募していません。興味のある案件を見つけて応募してみましょう。</p>
                        <Link href="/" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                            案件を探す
                        </Link>
                    </div>
                    
                    <div v-else class="space-y-6">
                        <!-- Stats Overview -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-white p-4 rounded-lg shadow-sm border">
                                <div class="text-2xl font-bold text-gray-900">{{ entryStats.total }}</div>
                                <div class="text-sm text-gray-600">総件数</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm border">
                                <div class="text-2xl font-bold text-blue-600">{{ entryStats.applications }}</div>
                                <div class="text-sm text-gray-600">応募</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm border">
                                <div class="text-2xl font-bold text-green-600">{{ entryStats.offers }}</div>
                                <div class="text-sm text-gray-600">オファー</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow-sm border">
                                <div class="text-2xl font-bold text-red-600">{{ entryStats.cancelled }}</div>
                                <div class="text-sm text-gray-600">取消済</div>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="bg-white p-4 rounded-lg shadow-sm border">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div class="flex-1 max-w-md">
                                    <div class="relative">
                                        <input 
                                            v-model="searchQuery"
                                            type="text" 
                                            placeholder="案件名、スキル、勤務地で検索..." 
                                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <button 
                                    @click="toggleAllDetails"
                                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors flex items-center"
                                >
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                    {{ showAllDetails ? '全て閉じる' : '全て展開' }}
                                </button>
                            </div>
                        </div>
                        
                        <!-- Results -->
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <p class="text-sm text-gray-600">
                                    {{ filteredEntries.length }}件の応募履歴
                                    <span v-if="searchQuery">（「{{ searchQuery }}」で検索）</span>
                                </p>
                            </div>
                            
                            <TransitionGroup
                                name="list"
                                tag="div"
                                class="space-y-4"
                                enter-active-class="transition-all duration-500 ease-out"
                                enter-from-class="opacity-0 transform scale-95 translate-y-4"
                                enter-to-class="opacity-100 transform scale-100 translate-y-0"
                                leave-active-class="transition-all duration-300 ease-in"
                                leave-from-class="opacity-100 transform scale-100"
                                leave-to-class="opacity-0 transform scale-95"
                            >
                                <EntryCard 
                                    v-for="entry in filteredEntries" 
                                    :key="`${entry.id}-${entry.status_id}`"
                                    :entry="entry" 
                                    :force-show-details="showAllDetails"
                                    @cancelError="showErrorAlert"
                                />
                            </TransitionGroup>
                        </div>
                        
                        <div v-if="filteredEntries.length === 0 && searchQuery" class="bg-white rounded-lg p-8 text-center shadow-sm">
                            <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
                            <p class="text-gray-600">「{{ searchQuery }}」に一致する応募履歴がありませんでした。</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-active {
    position: absolute;
    right: 0;
    left: 0;
}
</style>