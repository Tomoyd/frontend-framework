<template>
  <BaseLayout>
    <template #header="{ title }">
      <div>{{ title }}</div>
    </template>
    <div>1111</div>
    <template v-slot:footer="scopeInfo">
      <div>hello world{{ scopeInfo.text }}</div>
    </template>
  </BaseLayout>
</template>
<!-- slot  只需要用来进行同时封装逻辑和布局组合就行了，无渲染组件使用组合式编程更好-->
<script lang="ts" setup>
import BaseLayout from './BaseLayout.vue';
</script>
