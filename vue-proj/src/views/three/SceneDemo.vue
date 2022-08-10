<template>
  <div id="three" class="container"></div>
</template>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
<script lang="ts" setup>
import { useThree } from '@/hooks/useThree';
import { onMounted } from 'vue';
const three = useThree('three');
onMounted(() => {
  three.addCustomGeometry();
});
</script>
