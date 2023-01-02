<template>
  <div>{{ message }} base: <input v-model="message" /></div>
</template>

<script lang="ts" setup>
import { messageKey } from '@/common/provideKeys';
import { inject } from 'vue';
const { message } = inject(messageKey) || {};
</script>
