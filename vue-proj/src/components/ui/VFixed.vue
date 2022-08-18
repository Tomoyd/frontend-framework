<template>
  <div class="fixed" :style="{ left: left + 'px', top: top + 'px' }">
    <slot></slot>
  </div>
</template>
<style scoped>
.fixed {
  color: #ee0000;
  left: 30px;
  top: 10px;
  position: fixed;
  background-color: #3d3d3d;
  padding: 10px;
}
</style>

<script lang="ts" setup>
const props = defineProps<{ left?: number; top?: number }>();
console.log('props.top', props.top);
</script>
