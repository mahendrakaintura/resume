<script setup>
import { Head, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import Modal from '@/Components/Modal.vue';

const showUnregisterModal = ref(false);

const unregister = () => {
    router.delete(route('mypage.unregister.destroy'));
}
</script>

<template>
    <Head title="退会" />
    <AppLayout>
        <template #main>
            <div class="py-12">
                <div class="max-w-5xl mx-auto px-6">
                    <div class="bg-white rounded-md shadow-sm mt-4 py-10 flex flex-col gap-10">
                        <div class="flex justify-center text-justify px-4">
                            退会する方は、下記の「退会する」ボタンをクリックする
                        </div>

                        <div class="flex justify-center space-x-3">
                            <button
                                type="button"
                                @click="showUnregisterModal = true"
                                class="rounded bg-blue-500 hover:bg-blue-400 text-white text-base font-bold px-8 py-2"
                            >
                                退会する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout>
    <Modal :show="showUnregisterModal" @close="showUnregisterModal = false">
        <div class="p-6">
            <h2 class="text-lg font-bold text-gray-900">
                退会の確認
            </h2>
            <div class="mt-4">
                <p class="text-sm text-gray-600">ジョブステーションを退会します</p>
                <p class="mt-2 text-sm text-gray-600">実行してよろしいですか？</p>
            </div>
            <div class="mt-6 flex justify-end gap-4">
                <button type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    @click="showUnregisterModal = false">
                    いいえ
                </button>
                <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                    @click="unregister">
                    はい
                </button>
            </div>
        </div>
     </Modal>
</template>