<script setup lang="ts">
import { customRef, ref, shallowRef, triggerRef, watchEffect } from 'vue';

const counter = ref({ count: 0 });
const shallow = shallowRef({
  greet: 'Hello',
});
function useCustomRef<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        value = newValue;
        trigger();
      },
    };
  });
}

const cus = useCustomRef('custom');

counter.value = { count: 1 };
watchEffect(() => {
  console.log('first', shallow.value.greet);
});

function shallowTrigger() {
  shallow.value.greet = 'hello world!';

  // 触发
  triggerRef(shallow);
}
</script>

<template>
  <div>{{ counter.count }}</div>
  <div>{{ shallow.greet }}</div>
  <div>{{ cus }}</div>
  <button @click="shallowTrigger">trigger shallow</button>
  <input v-model="cus" />
</template>
