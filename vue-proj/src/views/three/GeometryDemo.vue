<template>
  <div id="three"></div>
  <div class="selection">
    geometry:
    <SelectBasic :options="geoOptions" v-model="geoType" />
    material:
    <SelectBasic :options="materialOptions" v-model="materialType" />
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
import { getObjResManageHooks } from '@/hooks/useObjResManage';

import { useThree } from '@/hooks/useThree';
import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from 'three';
import { onMounted } from 'vue';
/*
 bufferGeometry 只有attribute属性和index属性，提供的内部数据组合形式与GPG所期待的数据结构保持一致，
 提高了运行效率
 attribute 本身是一个分量属性，所存储的信息是会被直接送往GPU处理的，需要借助Float32Array数组，
    每三个数组元素指定一个顶点，每三个顶点确定一个面
 index 可以通过index 去指定组成每一个面的顶点

 Geometry 与 BufferGeometry 相互之间可以 进行转换 fromBufferGeometry fromGeometry
 */

function getMaterials() {
  return {
    basic: new MeshBasicMaterial({ color: 0xffff00 }),
    basicWireFrame: new MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
  };
}

function createCubeByGeometry(material: Material) {
  return function (geometry: BufferGeometry) {
    return new Mesh(geometry, material);
  };
}

function getGeometries() {
  return {
    plane: new PlaneGeometry(50, 50, 10, 10),
    box: new BoxGeometry(30, 30, 30),
  };
}

function init() {
  const createCubeByBasic = createCubeByGeometry(
    new MeshBasicMaterial({ color: 0xffff00 })
  );
  cube = createCubeByBasic(geoOptions[geoType.value]);
  three.add(cube);
}

const three = useThree('three');
let cube: Mesh;
const useResManage = getObjResManageHooks({
  afterEffect: () => window.requestAnimationFrame(three.render),
});

const [geoType, geoOptions] = useResManage(
  getGeometries(),
  (current) => {
    cube.geometry = current;
  },
  'plane'
);

const [materialType, materialOptions] = useResManage(
  getMaterials(),
  (current) => {
    cube.material = current;
  },
  'basic'
);

onMounted(() => init());
</script>
