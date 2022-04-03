<script setup lang="ts">
import { store } from '@/store';
import { ref, watch, inject } from 'vue';
const contextNum = inject('contextNum');
let foo = ref(0);
const name = '123';

function onClick() {
  foo.value += 1;
}

watch(foo, () => {
  console.log('name', name);
});
</script>

<template>
  <div>
    <div>store:{{ store.count }}</div>
    <div>contextNum:{{ contextNum }}</div>
    <div @click="onClick">add</div>
    <slot></slot>
    <slot name="scope" :code="foo"></slot>
    <slot name="footer"></slot>
  </div>
</template>
