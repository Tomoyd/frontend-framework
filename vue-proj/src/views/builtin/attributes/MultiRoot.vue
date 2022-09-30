<template>
  <button>{{ $attrs.name }}</button>
  <p>hello{{ set }}</p>
  {{ num }}
</template>

<script lang="ts" setup>
import { computed, useAttrs, watch } from 'vue';
const props = defineProps<{ set: string }>();
const attrs = useAttrs();
watch(props, (value, old) => {
  console.log('watch');
});

watch(attrs, (value, old) => {
  //  非响应式的，不可用watch
  console.log('atrrs', value, old);
});

const num = computed(() => {
  // computed 中可以响应
  console.log('computed', attrs.name);

  return 1;
});
</script>
