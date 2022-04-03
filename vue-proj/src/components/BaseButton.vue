<script setup lang="ts">
import { store } from '@/store';
</script>
<template>
  <button @click="store.increment">
    click me
    <span>hello</span>
    <span>9999</span>
  </button>
</template>
