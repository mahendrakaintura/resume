<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isSearching: {
    type: Boolean,
    required: true
  },
  filterOptions: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({ text: '', option: '' })
  }
})

const emit = defineEmits(['update:modelValue'])
const inputValue = ref(props.modelValue.text)
const selectedOption = ref(props.modelValue.option)

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue.text
  selectedOption.value = newValue.option
}, { deep: true })

watch(inputValue, (newValue) => {
  emit('update:modelValue', {
    text: newValue,
    option: selectedOption.value
  })
})

watch(selectedOption, (newValue) => {
  emit('update:modelValue', {
    text: inputValue.value,
    option: newValue
  })
})
</script>

<template>
  <div class="relative w-full">
    <input type="text" v-model="inputValue" :disabled="isSearching" placeholder="言語・スキルを入力"
      class="w-full rounded-md border-gray-300 focus:border-blue-500 text-sm py-2 pl-3 pr-24" />

    <div class="absolute right-0 top-0 h-full flex items-center">
      <select v-model="selectedOption" :disabled="isSearching"
        class="h-full w-24 border-l border-gray-300 rounded-r-md focus:border-blue-500 text-sm py-2 pl-2 pr-8 bg-gray-50 hover:bg-gray-100 truncate">
        <option value="">選択...</option>
        <option v-for="(label, value) in filterOptions.languages" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>
  </div>
</template>