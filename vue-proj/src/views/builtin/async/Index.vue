<template>
  <div><MyAsyncComponent /> <MyLazyComponent /></div>
</template>
<script lang="ts" setup>
import LoadingComponentVue from '@/components/LoadingComponent.vue';
import {
  defineAsyncComponent,
  defineComponent,
  type DefineComponent,
} from 'vue';

// 异步组件可以自己制定，加载时组件展示，加载组件延时，错误，timeout
// 异步组件会触发 Suspense，用Suspense后 加载组件，延时，错误 都由Suspense进行控制
// Suspense 目前是实验性的
const MyLazyComponent = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('./MyComponent.vue') as any);
      }, 1000);
    });
  },
  loadingComponent: LoadingComponentVue,
  delay: 200,
  errorComponent: LoadingComponentVue,
  timeout: 3000,
});
const MyAsyncComponent = defineAsyncComponent(() => {
  return import('./MyComponent.vue');
});
</script>
