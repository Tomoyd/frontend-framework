<template>only show:{{ res?.message }}</template>

<script setup lang="ts">
import { messageKey } from '@/common/provideKeys';
import { inject } from 'vue';

const res = inject(messageKey);
</script>
