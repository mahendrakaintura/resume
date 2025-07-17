<script setup>
import { router, useForm } from '@inertiajs/vue3'
import axios from 'axios'

const props = defineProps({
    show: Boolean,
    projectId: {
        type: [Number, String],
        required: true
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'submitted'])

const startEntry = async (type) => {
    if (type === 'register') {
        router.get(route('entry.start.register', { project: props.projectId }))
        return
    }

    if (!props.isAuthenticated) {
        try {
            await axios.get(route('entry.start', { project: props.projectId }));
            window.location.href = route('login');
        } catch (error) {
            alert('エラーが発生しました。');
        }
        return;
    }

    try {
        const response = await axios.get(route('entry.start', { project: props.projectId }))
        const { success, message, redirect } = response.data

        if (message) {
            window.alert(message)
        }

        if (success) {
            emit('submitted')
        }

        if (redirect) {
            window.location.href = redirect
        }
    } catch (error) {
        window.alert(error.response?.data?.message || 'エラーが発生しました')
    }
}

const preventBackdropClick = (e) => {
    e.stopPropagation()
}

const closeModal = () => {
    emit('close')
}
</script>

<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-90 z-50">
        <div class="relative w-full max-w-lg mx-4" @click="preventBackdropClick">
            <div class="bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="flex justify-between items-center bg-gray-200 px-6 py-4">
                    <h3 class="text-xl font-bold text-gray-800">
                        {{ isAuthenticated ? 'エントリーしますか？' : '会員登録をしていますか？' }}
                    </h3>
                    <button type="button" @click="$emit('close')"
                        class="rounded-md p-2 hover:bg-gray-300 transition-colors duration-200">
                        <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                        </svg>
                    </button>
                </div>
                <div class="px-6 py-8">
                    <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button @click="startEntry('login')"
                            class="w-full sm:w-48 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white text-lg font-bold rounded transition-colors duration-200">
                            はい
                        </button>
                        <button @click="isAuthenticated ? $emit('close') : startEntry('register')"
                            class="w-full sm:w-48 px-6 py-3 bg-gray-500 hover:bg-gray-400 text-white text-lg font-bold rounded transition-colors duration-200">
                            いいえ<br>
                            <span v-if="!isAuthenticated">(会員登録)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>