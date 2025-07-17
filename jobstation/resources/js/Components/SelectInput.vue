<script setup>
defineProps({
    modelValue: {
        type: [String, Number],
        required: true,
    }
});

defineEmits(['update:modelValue']);
</script>

<template>
    <select
        class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
        <slot></slot>
    </select>
</template>