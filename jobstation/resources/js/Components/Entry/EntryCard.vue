<script setup>
import { ref, watch } from 'vue'
import { Link } from '@inertiajs/vue3'
import CancelModal from './CancelModal.vue'

const props = defineProps({
    entry: {
        type: Object,
        required: true
    },
    forceShowDetails: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['cancelError'])

// Format price in Japanese yen
const formatPrice = (price) => {
    if (!price) return ''
    
    // Remove any existing currency symbols first
    let cleanPrice = String(price).replace(/[\$¥€£,\s]/g, '')
    
    // If it's already formatted with 円, return as is but remove any $ symbols
    if (String(price).includes('円')) {
        return String(price).replace(/\$/g, '')
    }
    
    // If it's a number or numeric string, format it as yen
    const numericPrice = parseInt(cleanPrice)
    if (!isNaN(numericPrice)) {
        return `¥${numericPrice}万円`
    }
    
    return String(price).replace(/\$/g, '')
}

const showCancelModal = ref(false)
const showDetails = ref(false)

const toggleDetails = () => {
    if (!props.forceShowDetails) {
        showDetails.value = !showDetails.value
    }
}

// Watch for changes in forceShowDetails prop
watch(() => props.forceShowDetails, (newValue) => {
    showDetails.value = newValue
}, { immediate: true })
</script>

<template>
    <div class="border border-gray-300 bg-white rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <!-- Main entry header -->
        <div class="p-4 bg-gray-50">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        <span v-if="entry.status_id <= 4">{{ entry.project_title }}</span>
                        <Link v-else :href="route('projects.show', entry.project_id)" 
                              class="underline text-blue-600 hover:text-blue-800">
                            {{ entry.project_title }}
                        </Link>
                    </h3>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            申込日: {{ (entry.created_at ?? entry.offered_at).slice(0, 10).replace(/-/g, "/") }}
                        </span>
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {{ entry.status_id <= 4 ? '応募' : 'オファー' }}
                        </span>
                        <span v-if="entry.status_id == 2" class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            取消済
                        </span>
                    </div>
                    
                    <!-- Quick preview info always visible -->
                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div v-if="entry.project_workplace" class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="truncate">{{ entry.project_workplace }}</span>
                        </div>
                        <div v-if="entry.project_price" class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                            <span class="font-medium price-display">{{ formatPrice(entry.project_price) }}</span>
                        </div>
                        <div v-if="entry.project_period" class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="truncate">{{ entry.project_period }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button @click="toggleDetails" 
                            :disabled="forceShowDetails"
                            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="forceShowDetails">詳細表示中</span>
                        <span v-else>{{ showDetails ? '詳細を隠す' : '詳細を表示' }}</span>
                        <svg v-if="!forceShowDetails" class="w-4 h-4 ml-1 transition-transform" 
                             :class="{ 'rotate-180': showDetails }" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <button v-if="entry.status_id == 1"
                            type="button"
                            @click="showCancelModal = true"
                            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        取り消す
                    </button>
                </div>
            </div>
        </div>

        <!-- Detailed project information (collapsible) -->
        <Transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-screen opacity-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="max-h-screen opacity-100"
            leave-to-class="max-h-0 opacity-0"
        >
            <div v-show="showDetails" class="overflow-hidden">
                <div class="p-4 border-t bg-white">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Project Details -->
                        <div class="space-y-4">
                            <h4 class="font-medium text-gray-900 border-b pb-2">案件詳細</h4>
                            <dl class="space-y-3">
                                <div v-if="entry.project_period">
                                    <dt class="text-sm font-medium text-gray-500">期間</dt>
                                    <dd class="text-sm text-gray-900 mt-1">{{ entry.project_period }}</dd>
                                </div>
                                <div v-if="entry.project_working_hours">
                                    <dt class="text-sm font-medium text-gray-500">勤務時間</dt>
                                    <dd class="text-sm text-gray-900 mt-1">{{ entry.project_working_hours }}</dd>
                                </div>
                                <div v-if="entry.project_workplace">
                                    <dt class="text-sm font-medium text-gray-500">勤務地</dt>
                                    <dd class="text-sm text-gray-900 mt-1">{{ entry.project_workplace }}</dd>
                                </div>
                                <div v-if="entry.project_price">
                                    <dt class="text-sm font-medium text-gray-500">単価</dt>
                                                                                                            <dd class="text-sm text-gray-900 font-semibold mt-1 price-display">{{ formatPrice(entry.project_price) }}</dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Additional Details -->
                        <div class="space-y-4">
                            <h4 class="font-medium text-gray-900 border-b pb-2">募集要項</h4>
                            <dl class="space-y-3">
                                <div v-if="entry.project_head_count">
                                    <dt class="text-sm font-medium text-gray-500">募集人数</dt>
                                    <dd class="text-sm text-gray-900 mt-1">{{ entry.project_head_count }}</dd>
                                </div>
                                <div v-if="entry.project_monthly_working_hours">
                                    <dt class="text-sm font-medium text-gray-500">月間想定稼働時間</dt>
                                    <dd class="text-sm text-gray-900 mt-1">{{ entry.project_monthly_working_hours }}</dd>
                                </div>
                                <div v-if="entry.project_skills">
                                    <dt class="text-sm font-medium text-gray-500">必要スキル</dt>
                                    <dd class="mt-1">
                                        <div class="flex flex-wrap gap-1">
                                            <span v-for="skill in entry.project_skills.split(', ')" 
                                                  :key="skill"
                                                  class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {{ skill.trim() }}
                                            </span>
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Project Summary -->
                    <div v-if="entry.project_summary" class="mt-6 pt-4 border-t">
                        <h4 class="font-medium text-gray-900 mb-3">案件概要</h4>
                        <p class="text-sm text-gray-700 leading-relaxed">{{ entry.project_summary }}</p>
                    </div>

                    <!-- Action buttons in expanded view -->
                    <div v-if="entry.status_id > 4" class="mt-6 pt-4 border-t">
                        <Link :href="route('projects.show', entry.project_id)" 
                              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                            案件ページを確認
                        </Link>
                    </div>
                </div>
            </div>
        </Transition>
    </div>

    <CancelModal
        :show="showCancelModal"
        :entry-id="entry.id"
        @close="showCancelModal = false"
        @cancel="entry.status_id = 2"
        @error="emit('cancelError')"
    />
</template>

<style scoped>
/* Prevent browser extensions from auto-formatting prices */
.price-display {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

/* Ensure no automatic currency conversion */
span[class*="font-medium"] {
    font-feature-settings: normal;
    text-transform: none;
}
</style>