<script setup>
import axios from 'axios'

const props = defineProps({
    show: Boolean,
    entryId: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['close', 'cancel', 'error'])

const cancelEntry = async () => {
    emit('close');
    try {
        await axios.patch(route('mypage.entries.cancel'), { entry_id: props.entryId })
        emit('cancel');
    } catch (error) {
        emit('error');
    }
}
</script>

<template>
    <div v-if="show" @click="$emit('close')"
        class="fixed top-0 left-0 flex items-center justify-center bg-gray-500 bg-opacity-90 w-full h-full z-10">
        <div class="flex justify-center items-center border border-indigo-500 bg-white w-4/5 sm:w-auto p-1 z-20" @click.stop>
            <div class="container overflow-y-hidden h-auto px-5 py-8 sm:w-[500px]">
                <div class="flex justify-center text-center rounded bg-gray-200 font-bold text-md sm:text-xl p-1">
                    <h3>エントリーを取り消しますか？</h3>
                </div>
                <div class="flex w-full mt-10 p-2 justify-center space-x-4">
                    <button @click="cancelEntry()"
                        class="rounded bg-blue-500 hover:bg-blue-400 text-white text-lg font-bold py-2 w-48 text-center">
                        はい
                    </button>
                    <button  @click="$emit('close')"
                        class="rounded text-white bg-gray-500 hover:bg-gray-400 text-lg font-bold py-2 w-48 text-center">
                        いいえ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>