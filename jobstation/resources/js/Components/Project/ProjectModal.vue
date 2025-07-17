<script setup>
import { ref } from 'vue'
import EntryModal from '@/Components/Entry/EntryModal.vue'

const props = defineProps({
    show: Boolean,
    project: {
        type: Object,
        required: true
    },
})

const showEntryModal = ref(false)

const emit = defineEmits(['close'])
</script>

<template>
    <div v-if="show" @click="$emit('close')"
        class="fixed top-0 left-0 flex items-center justify-center bg-gray-500 bg-opacity-90 w-full h-full z-10 h">
        <div class="container px-5 py-8 sm:w-[500px] h-4/5" @click.stop>
            <div class="mx-w-2xl mx-auto bg-white rounded-md shadow-sm p-6 h-full flex flex-col justify-between">
                <div class="mt-4 space-y-4 overflow-y-auto">
                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 件名</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.title }}</p>
                    </section>    

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 期間</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.period }}</p>
                    </section>

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 時間</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.working_hours }}</p>
                    </section>

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 場所</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.workplace }}</p>
                    </section>

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ リモートワーク</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.remote_work_display || '相談' }}</p>
                    </section>

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 単価</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.display_price }}</p>
                    </section>

                    <section>
                        <h2 class="text-base font-bold text-gray-900">◎ 案件概要</h2>
                        <p class="mt-1 text-sm text-gray-600">{{ project.summary }}</p>
                    </section>
                </div>
                <div class="mt-6 flex justify-center space-x-3">
                    <button 
                        type="button"
                        @click="$emit('close')"
                        class="rounded bg-gray-500 hover:bg-gray-400 text-white text-base font-bold px-4 py-2 w-28"
                    >
                        戻る
                    </button>
                    <button
                        type="button"
                        @click="showEntryModal = true"
                        :disabled="project.has_entry"
                        :class="project.has_entry ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-400'"
                        class="rounded text-white text-base font-bold px-4 py-2 w-28"
                    >
                        エントリー
                    </button>
                </div>
            </div>
        </div>
    </div>
    <EntryModal :show="showEntryModal" :project-id="project.id" :is-authenticated="$page.props.auth.user !== null"
        @close="showEntryModal = false" />
</template>