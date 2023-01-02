<template>
  <div><slot></slot></div>
  <div><input v-model="message" /></div>
</template>
<script lang="ts" setup>
import { messageKey } from '@/common/provideKeys';
import { provide, ref } from 'vue';
const message = ref('message');
provide(messageKey, { message });
</script>
