<template>
  <div>
    <div>hello 生命周期</div>
    <!-- <div>{{ counter }}</div> -->
    <input v-model="counter" />
    <ErrorTest v-if="!error" />
  </div>
</template>

<script setup lang="ts">
/**
 * 生命周期
 * onMounted
 * onUpdated
 * onUnmounted
 * onBeforeMount
 * OnBeforeUpdate
 * onBeforeUnmount
 *
 * onErrorCaptured
 */

import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
} from 'vue';
import ErrorTest from './ErrorTest.vue';

const counter = ref(1);
const error = ref(false);
onBeforeMount(() => {
  console.log('onBeforeMount');
});
onMounted(() => {
  console.log('mounted');
});
onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});
onUpdated(() => {
  console.log('onUpdated');
});
onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});
onUnmounted(() => {
  console.log('onUnmounted');
});

// KeepAlive 时使用， 不会执行mount的参数
onActivated(() => {
  console.log('onActivated');
});
onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err) => {
  // 下层组件的捕获错误,
  console.log('err', err);
  error.value = true;

  // 不向上层报错，app.config.errorHandle 将捕获不到这个错误
  return false;
});
</script>
