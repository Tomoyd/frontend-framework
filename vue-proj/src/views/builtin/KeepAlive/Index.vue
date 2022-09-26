<template>
  <div>
    <button
      v-for="(_, tabName) in tabs"
      :key="tabName"
      @click="handTabClick(tabName)"
    >
      {{ tabName }}
    </button>
    <keep-alive include="ComponentA" :exclude="['ComponentB']">
      <component :is="tabs[comp]" />
    </keep-alive>
  </div>
</template>
<!-- 缓存的是组件实例，再次进行激活时，不会重新实例化-->
<!-- include  exclude 可以指定组件名数组，或者字符串逗号分隔，或者正则表达式-->
<!-- max属性限制最大缓存数,当超过时,会将最久没缓存的销毁抛弃 -->
<!-- onActivated   在组件挂载,从缓存中插入,-->
<!-- onDeactivated 在组件卸载，从dom中移除进入缓存时 -->
<!-- onActivated onDeactivated 被缓存组件的子组件，也会被触发这两个生命周期 -->
<script lang="ts" setup>
import { ref } from 'vue';
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';
const tabs = {
  ComponentA,
  ComponentB,
};

type ComponentKey = keyof typeof tabs;

function handTabClick(tabName: ComponentKey) {
  comp.value = tabName;
}
const comp = ref<ComponentKey>('ComponentA');
</script>
