<template>
  <div id="three"></div>
  <div class="selection">
    geometry:
    <SelectBasic :options="geoOptions" v-model="geoType" />
    material:
    <SelectBasic :options="materialOptions" v-model="materialType" />
    <button @click="toggleRotate">toggle rotation</button>
    <slot name="default"></slot>
  </div>
</template>
<style>
.selection {
  color: #ee0000;
  left: 10px;
  top: 10px;
  position: fixed;
  background-color: #3d3d3d;
  padding: 10px;
}
.temp {
  color: #ff0000;
}
</style>

<script lang="ts" setup>
import SelectBasic from '@/components/SelectBasic.vue';
import { useThreeContainer } from '@/hooks/useThreeContainer';
console.log('1233', 1233);
const { materialOptions, materialType, geoOptions, geoType, toggleRotate } =
  useThreeContainer();
</script>
