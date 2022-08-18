<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="90" :top="5">
    <SelectBasic :options="textureOptions" v-model="textureType" />
    <SelectBasic :options="geoOptions" v-model="geoType" />
  </VFixed>
</template>
<script lang="ts" setup>
import {
  createCubeByGeometry,
  getTextureLoader,
  createGroundPlane,
  createSpotLight,
} from '@/common/three';
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
    texture: 'brick-wall.jpg',
    dds: 'test-dxt1.dds',
    bumpMap: 'stone.jpg',
    normalMap: 'plaster.jpg',
    displacementMap: 'w_c.jpg',
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
const load = getTextureLoader('/three/textures/');

const [textureType, textureOptions] = useObjResManage(
  getTextureType(),
  async (current, key) => {
    const names = [current];

    const loadType = key === 'dds' ? 'dds' : 'texture';
    let mapType: 'map' | 'normalMap' | 'bumpMap' | 'displacementMap' = 'map';
    if (key === 'bumpMap') {
      mapType = key;
      names[1] = 'stone-bump.jpg';
    }
    if (key === 'normalMap') {
      mapType = key;
      names[1] = 'plaster-normal.jpg';
    }
    if (key === 'displacementMap') {
      mapType = key;
      names[1] = 'w_d.png';
    }

    const material = await load(names, loadType, mapType);
    if (material) {
      box.material = material;
    }
  },
  'texture'
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
    (await load([textureOptions.texture])) as Material
  )(geoOptions.box);
  box.castShadow = true;

  three.add(box);
  three.add(new AmbientLight(0x444444));
  three.add(createGroundPlane());
  three.add(createSpotLight());
  three.mount();
  three.loopRender();
}

onMounted(() => {
  init();
});
</script>
