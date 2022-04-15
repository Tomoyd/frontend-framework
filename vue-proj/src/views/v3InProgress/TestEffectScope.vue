<script lang="ts" setup>
import {
  effectScope,
  getCurrentScope,
  onScopeDispose,
  ref,
  watchEffect,
} from 'vue';
// 创建副作用的作用域，用来存储和删除副作用,副作用可以嵌套，分离的将不会被父范围收集
let scope = effectScope(false);

const counter = ref(1);

scope.run(() => {
  onScopeDispose(() => {
    console.log('scope', scope);
  });
  console.log('scope===', getCurrentScope() === scope);
  watchEffect(() => {
    console.log('scope===', getCurrentScope() === scope);
    if (counter.value > 2) {
      scope.stop();
    }

    console.log('value', counter.value);
  });
});
// 获取当前活跃的作用域
console.log('getCurrentScope', getCurrentScope() === scope);
</script>
<template>
  <div>
    <input v-model="counter" type="number" />
  </div>
</template>
