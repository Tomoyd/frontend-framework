<template>
  <select v-model="option">
    <option v-for="(_, key) in options" :name="key" :key="key" :value="key">
      {{ key }}
    </option>
  </select>
</template>
<style></style>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: object;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', val: string): void;
  (event: 'change'): void;
}>();

const option = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    console.log('val', val);
    return emit('update:modelValue', val);
  },
});
</script>
