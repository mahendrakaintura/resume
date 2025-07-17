<script setup>
import { Head } from '@inertiajs/vue3'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import ProjectCard from '@/Components/Project/ProjectCard.vue'
import Modal from '@/Components/Modal.vue'
import axios from 'axios'

const props = defineProps({
    projects: {
        type: Object,
        required: true
    }
})

const showingProjects = ref(props.projects)
const checkedIds = ref([]);
const showConfirmModal = ref(false);

function updateCheckedIds({ id, checked }) {
    if (checked) {
        if (!checkedIds.value.includes(id)) {
            checkedIds.value.push(id);
        }
    } else {
        checkedIds.value = checkedIds.value.filter(_id => _id !== id);
    }
}
    
async function deleteFavorites() {
    if (!checkedIds.value.length) return;
    showConfirmModal.value = false;
    try {
        const response = await axios.delete(route('mypage.favorites.destroy'), { data: { project_ids: checkedIds.value } })
        showingProjects.value = showingProjects.value.filter(project => !response.data.deletedIds.includes(project.id));
        checkedIds.value = [];
    } catch (error) {
        router.get(route('mypage.favorites.'));
    }
}
</script>

<template>
    <Head title="お気に入り" />
    <AppLayout>
        <template #main>
            <div class="front-content sm:flex w-full p-10">
                <div class="mx-auto sm:w-2/3 h-full sm:pl-5">
                    <div class="flex justify-end mb-4 space-x-2">
                        <button @click="showConfirmModal = checkedIds.length != 0" class="px-4 py-2 rounded" :class="checkedIds.length ? 'bg-blue-500 text-white' : 'bg-gray-200'">
                            削除
                        </button>
                    </div>
                    <div v-if="showingProjects.length === 0" class="bg-white rounded-lg p-6 text-center">
                        <p class="text-gray-600">お気に入り案件がありません。</p>
                    </div>
                    <div v-else class="space-y-5 max-h-lvh overflow-y-auto">
                        <div v-for="project in showingProjects" :key="project.id">
                            <ProjectCard :project="project" :isMypage="true" @check="updateCheckedIds" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
    <Modal :show="showConfirmModal" @close="showConfirmModal = false">
        <div class="p-6">
            <h2 class="text-lg font-bold text-gray-900">
                確認
            </h2>
            <div class="mt-4">
                <p class="text-sm text-gray-600">お気に入り案件の削除を行います。</p>
                <p class="mt-2 text-sm text-gray-600">実行してよろしいですか？</p>
            </div>
            <div class="mt-6 flex justify-end gap-4">
                <button type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    @click="showConfirmModal = false">
                    いいえ
                </button>
                <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    @click="deleteFavorites">
                    はい
                </button>
            </div>
        </div>
     </Modal>
</template>
