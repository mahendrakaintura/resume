<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'success'
    },
    autoClose: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 5000
    }
});

const isVisible = ref(false);
let timeoutId = null;

watch(() => props.message, (newVal) => {
    if (newVal) {
        showAlert();
    }
}, { immediate: true });

onMounted(() => {
    if (props.message) {
        showAlert();
    }
});

const showAlert = () => {
    isVisible.value = true;
    
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    
    if (props.autoClose) {
        timeoutId = setTimeout(() => {
            close();
        }, props.duration);
    }
};

const close = () => {
    isVisible.value = false;
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
};
</script>

<template>
    <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="isVisible && message" 
            class="fixed bottom-0 right-0 mb-4 mr-4 w-full max-w-sm overflow-hidden z-50">
            <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                :class="{
                    'bg-green-50': type === 'success',
                    'bg-red-50': type === 'error',
                    'bg-yellow-50': type === 'warning'
                }">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg v-if="type === 'success'"
                                class="h-6 w-6 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <svg v-if="type === 'error'"
                                class="h-6 w-6 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <svg v-if="type === 'warning'"
                                class="h-6 w-6 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24" 
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <div class="ml-3 w-0 flex-1">
                            <p :class="{
                                'text-green-800': type === 'success',
                                'text-red-800': type === 'error',
                                'text-yellow-800': type === 'warning'
                            }" class="text-sm font-medium">
                                {{ message }}
                            </p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button @click="close"
                                class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span class="sr-only">閉じる</span>
                                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>