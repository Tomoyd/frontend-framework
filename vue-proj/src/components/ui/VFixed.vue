<template>
  <div class="fixed" style="{left,right}">
    <slot></slot>
  </div>
</template>
<style scoped>
.fixed {
  color: #ee0000;
  left: 10px;
  top: 10px;
  position: fixed;
  background-color: #3d3d3d;
  padding: 10px;
}
</style>

<script lang="ts" setup>
defineProps<{ left?: number; top?: number }>();
</script>
