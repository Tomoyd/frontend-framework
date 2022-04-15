<script lang="ts" setup>
import TestRefVue from './TestRef.vue';
import TestReactive from './TestReactive.vue';
import TestEffectScope from './TestEffectScope.vue';
import TestLifeCycle from './TestLifeCycle.vue';
import { provide, ref } from 'vue';
import TestProvide from './TestProvide.vue';
provide('name', 'provide');
const show = ref(true);

function onClick() {
  console.log('123', 123);
  show.value = !show.value;
}
</script>

<template>
  <div>
    <button @click="onClick">close</button>
    <!-- 组件必须有根标签时 v-show才会生效  且卸载时update钩子-->
    <KeepAlive>
      <TestLifeCycle v-if="show" />
    </KeepAlive>
    <TestProvide />

    <!-- <TestEffectScope />
    <TestReactive />
    <TestRefVue /> -->
  </div>
</template>
