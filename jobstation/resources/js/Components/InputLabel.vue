<script setup>
defineProps({
    value: {
        type: String,
    },
    required: {
        type: Boolean,
        default: false
    },
    tips: String
});
</script>

<template>
    <label class="block text-sm font-medium text-gray-700">
        <span v-if="value">
            {{ value }}
        </span>
        <span v-if="required" class="text-red-500"> 必須 </span>
        <span v-if="tips" class="text-blue-500">※{{ tips }} </span>
        <span v-else><slot /></span>
    </label>
</template>
