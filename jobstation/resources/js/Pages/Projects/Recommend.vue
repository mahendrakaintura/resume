<script setup>
import { Head} from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import RecommendCard from '@/Components/Project/RecommendCard.vue';

const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
})

</script>

<template>
    <Head title="レコメンド" />
    <AppLayout>
        <template #main>
            <div class="py-12">
                <div class="max-w-7xl mx-auto px-6">
                    <h1 class="text-2xl font-bold mb-2">レコメンド</h1>
                    <div class="bg-white p-6 shadow rounded-lg">
                        <div v-if="projects.length === 0" class="bg-white rounded-lg text-center">
                            <p class="text-gray-600">レコメンド案件がありません。</p>
                        </div>
                        <div v-else class="border-t flex flex-col items-stretch">
                            <RecommendCard v-for="(project, index) in projects" :key="projects.id"
                                :project="project" :isFirst="index === 0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
</template>