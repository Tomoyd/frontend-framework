<script lang="ts" setup>
import { inject } from 'vue';

const name = inject('name');
</script>

<template>
  <div>name:{{ name }}</div>
</template>
