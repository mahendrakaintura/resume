<script setup>
import { ref } from 'vue'
import EntryModal from '@/Components/Entry/EntryModal.vue'
import ProjectModal from '@/Components/Project/ProjectModal.vue'

const props = defineProps({
    project: {
        type: Object,
        required: true
    },
    isFirst: Boolean
})

const showEntryModal = ref(false)
const showProjectModal = ref(false)

const getBitNumber = (value) => {
    return value ? Math.log2(value) + 1 : 0;
}

</script>

<template>
    <div v-if="isFirst" class="text-center hidden md:flex border-x border-b items-center">
        <div class="w-[70px]">マッチ度</div>
        <div class="flex-1 border-l">案件名</div>
        <div class="w-24 border-l">稼働開始日</div>
        <div class="w-28 border-l">単価</div>
        <div class="w-36 border-l">場所</div>
        <div class="w-24 border-l">詳細</div>
        <div class="w-24 border-l">エントリー</div>
    </div>
    <div class="text-center hidden md:flex border-x border-b items-stretch">
        <div class="w-[70px] flex flex-col justify-center">{{ project.match_score }}/100</div>
        <div class="flex-1 flex flex-col justify-center border-l">{{ project.title }}</div>
        <div class="w-24 flex flex-col justify-center border-l">{{ `${project.start ? `${getBitNumber(project.start)}月` : ''}` }}</div>
        <div class="w-28 flex flex-col justify-center border-l">{{ project.display_price }}</div>
        <div class="w-36 flex flex-col justify-center border-l">{{ project.workplace }}</div>
        <div class="w-24 flex flex-col justify-center items-center border-l py-1">
            <button @click="showProjectModal = true" 
                class="rounded text-white bg-blue-500 hover:bg-blue-400 text-xs sm:text-sm font-bold py-2 w-20">
                詳細
            </button>
        </div>
        <div class="w-24 flex flex-col justify-center items-center border-l">
            <button @click="showEntryModal = true"
                :disabled="project.has_entry"
                :class="project.has_entry ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-400'"
                class="rounded text-white text-xs sm:text-sm font-bold py-2 w-20">
                エントリー
            </button>
        </div>
    </div>

    <div class="text-center flex md:hidden flex-col border-x border-b">
        <div class="flex items-center">
            <div class="w-20 sm:w-32">マッチ度</div>
            <div class="flex-1 p-1 border-l">{{ project.match_score }}/100</div>
        </div>
        <div class="flex items-center">
            <div class="w-20 sm:w-32">案件名</div>
            <div class="flex-1 p-1 border-l">{{ project.title }}</div>
        </div>
        <div class="flex items-center">
            <div class="w-20 sm:w-32">稼働開始日</div>
            <div class="flex-1 p-1 border-l">{{ `${project.start ? `${getBitNumber(project.start)}月` : ''}` }}</div>
        </div>
        <div class="flex items-center">
            <div class="w-20 sm:w-32">単価</div>
            <div class="flex-1 p-1 border-l">{{ project.display_price }}</div>
        </div>
        <div class="flex items-center">
            <div class="w-20 sm:w-32">場所</div>
            <div class="flex-1 p-1 border-l">{{ project.workplace }}</div>
        </div>
        <div class="flex items-center">
            <div class="w-20 sm:w-32"></div>
            <div class="text-center p-1 flex-1 justify-center items-center border-l flex justify-center gap-4">
                <button @click="showProjectModal = true" 
                    class="rounded text-white bg-blue-500 hover:bg-blue-400 text-xs sm:text-sm font-bold py-2 w-20">
                    詳細
                </button>
                <button @click="showEntryModal = true"
                    :disabled="project.has_entry"
                    :class="project.has_entry ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-400'"
                    class="rounded text-white text-xs sm:text-sm font-bold py-2 w-20">
                    エントリー
                </button>
            </div>
        </div>
    </div>

    <ProjectModal :show="showProjectModal" :project="project" @close="showProjectModal = false" />
    <EntryModal :show="showEntryModal" :project-id="project.id" :is-authenticated="$page.props.auth.user !== null" @close="showEntryModal = false" />
</template>