<script setup lang="ts">
import LoadingComponentVue from '../components/LoadingComponent.vue';
import { defineAsyncComponent, provide } from 'vue';
import MyButton from '../components/MyButton.vue';
import SlotDemo from '../components/SlotDemo.vue';
import { useMouse } from '@/hooks/useMouse';
import TestPlugin from '../components/TestPlugin.vue';
import { useRoute } from 'vue-router';
import TestTeleport from '../components/TestTeleport.vue';
import TestSuspense from '../components/TestSuspense.vue';

provide<number>('contextNum', 0);

const FooAsync = defineAsyncComponent(() => {
  return import('../components/FooAsyn.vue');
});

const { x, y } = useMouse();

const route = useRoute();

const FooAsyncDelay = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FooAsync);
      }, 4000);
    });
  },

  delay: 2000, //延迟时间大于2000 才会显示，以防闪烁
  loadingComponent: LoadingComponentVue,
  errorComponent: LoadingComponentVue,
  timeout: 10000,
});

function onClick() {
  alert('999');
  console.log('route', route.name);
}
</script>

<template>
  <main>
    <Suspense>
      <TestSuspense />
      <template #fallback>
        <div>loading... suspense</div>
      </template>
    </Suspense>

    <TestTeleport />
    <TestPlugin />
    <div>{{ `x:${x},y:${y}` }}</div>

    <FooAsyncDelay />
    <FooAsync />
    <MyButton @click="onClick" class="btn" me="hello" />
    <SlotDemo>
      <template #scope="{ code }">
        <div>code:{{ code }}</div>
      </template>
    </SlotDemo>
  </main>
</template>
