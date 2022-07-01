<template>
  <div id="container" className="panorama"></div>
</template>

<script lang="ts" setup>
import { usePanorama } from '@/hooks/usePanorama';

usePanorama('container');
</script>
<style scoped>
.panorama {
  overflow: hidden;
}
</style>
