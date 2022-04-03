<script setup lang="ts">
import { watchEffect } from 'vue';

watchEffect(() => {
  // console.log($route);
});
</script>

<template>
  <div>{{ $translate('greeting.say') }}</div>
</template>
