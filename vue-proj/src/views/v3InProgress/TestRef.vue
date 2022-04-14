<script setup lang="ts">
import { ref } from 'vue';

const counter = ref({ count: 0 });
console.log('counter', counter);
counter.value = { count: 1 };
</script>

<template>
  <div>{{ counter.count }}</div>
</template>
