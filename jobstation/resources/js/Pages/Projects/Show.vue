<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import EntryModal from '@/Components/Entry/EntryModal.vue'

const props = defineProps({
    project: Object
})

const showEntryModal = ref(false)

onMounted(() => {
    window.scrollTo(0, 0)
})

const handleBack = () => {
    window.history.back()
}
</script>

<template>

    <Head :title="project.title" />
    <AppLayout>
        <template #main>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav class="text-gray-500 text-sm mb-6">
                    <Link href="/" class="hover:text-gray-700">トップ</Link>
                    <span class="mx-2">/</span>
                    <span class="text-gray-900">案件詳細</span>
                </nav>

                <div class="max-w-2xl mx-auto bg-white rounded-md shadow-sm p-6">
                    <div class="mt-4 space-y-4">
                        <section v-for="(value, key) in {
                            '◎ 件名': project.title,
                            '◎ 期間': project.period,
                            '◎ 時間': project.working_hours,
                            '◎ 場所': project.workplace,
                            '◎ リモートワーク': project.remote_work_display || '相談',
                            '◎ 単価': project.display_price,
                            '◎ 概要': project.summary
                        }" :key="key">
                            <h2 class="text-base font-bold text-gray-900">{{ key }}</h2>
                            <p class="mt-1 text-sm text-gray-600">{{ value }}</p>
                        </section>

                        <div class="mt-6 flex justify-center space-x-3">
                            <button @click="handleBack"
                                class="rounded bg-gray-500 hover:bg-gray-400 text-white text-base font-bold px-8 py-2">
                                戻る
                            </button>
                            <button @click="showEntryModal = true"
                                class="rounded bg-blue-500 hover:bg-blue-400 text-white text-base font-bold px-8 py-2">
                                エントリー
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EntryModal :show="showEntryModal" :project-id="project.id"
                :is-authenticated="$page.props.auth.user !== null" @close="showEntryModal = false" />
        </template>
    </AppLayout>
</template>