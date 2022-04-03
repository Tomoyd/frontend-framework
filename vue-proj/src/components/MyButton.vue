<script lang="ts">
// 使用一个简单的 <script> to declare options 继承选项配置
export default {
  inheritAttrs: true,
};
</script>
<script setup lang="ts">
import { onMounted, useAttrs } from 'vue';
import BaseButton from './BaseButton.vue';
const props = defineProps<{
  me: string;
}>();

const attrs = useAttrs();

onMounted(() => {
  console.log('me', props.me);
  console.log('attrs', attrs.onClick);
});
</script>

<template>
  <BaseButton class="my-btn" />
</template>
