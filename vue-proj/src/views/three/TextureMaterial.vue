<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="90" :top="5">
    <SelectBasic :options="textureOptions" v-model="textureType" />
    <SelectBasic :options="geoOptions" v-model="geoType" />
  </VFixed>
</template>
<script lang="ts" setup>
import { createCubeByGeometry, getTextureLoader } from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import { useThree } from '@/hooks/useThree';
import {
  AmbientLight,
  BoxGeometry,
  IcosahedronGeometry,
  Material,
  Mesh,
  SphereGeometry,
} from 'three';
import { onMounted } from 'vue';
import SelectBasic from '../../components/SelectBasic.vue';

function getTextureType() {
  return {
    floorWood: 'floor-wood.jpg',
    brickWall: 'brick-wall.jpg',
    metalRust: 'metal-rust.jpg',
  };
}

function getGeometries() {
  return {
    box: new BoxGeometry(15, 15, 15),
    sphere: new SphereGeometry(10, 20, 20),
    icosahedron: new IcosahedronGeometry(10, 0),
  };
}

let box: Mesh;
const three = useThree();
const materialLoader = getTextureLoader('/three/textures/');

const [textureType, textureOptions] = useObjResManage(
  getTextureType(),
  async (current) => {
    const material = await materialLoader(current);
    if (material) {
      box.material = material;
    }
  },
  'brickWall'
);

const [geoType, geoOptions] = useObjResManage(
  getGeometries(),
  (current) => {
    box.geometry = current;
  },
  'box'
);

async function init() {
  box = createCubeByGeometry(
    (await materialLoader(textureOptions.floorWood)) as Material
  )(geoOptions.box);
  three.add(box);
  three.add(new AmbientLight(0xffffff));
  three.mount();
  three.loopRender();
}

onMounted(() => {
  init();
});
</script>
