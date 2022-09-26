<template>
  <div>A</div>
</template>
<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';

onMounted(() => {
  console.log('A Mounted');
});

onActivated(() => {
  console.log('A onActivated');
});

onDeactivated(() => {
  console.log('A onDeactivated');
});

onUnmounted(() => {
  console.log('A onUnmounted');
});
</script>
