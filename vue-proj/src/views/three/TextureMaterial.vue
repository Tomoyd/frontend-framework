<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="90" :top="5">
    texture:
    <SelectBasic :options="textureOptions" v-model="textureType" /> geometry:
    <SelectBasic :options="geoOptions" v-model="geoType" /> map:
    <SelectBasic :options="mapOptions" v-model="mapType" />
  </VFixed>
</template>
<script lang="ts" setup>
import {
  createCubeByGeometry,
  getTextureLoader,
  createGroundPlane,
  createSpotLight,
  loadTexture,
  loadObj,
} from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import { useThree } from '@/hooks/useThree';
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  BufferGeometryLoader,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  ObjectLoader,
  SphereGeometry,
  Texture,
} from 'three';
import { onMounted } from 'vue';
import SelectBasic from '../../components/SelectBasic.vue';

function getTextureType() {
  return {
    texture: 'brick-wall.jpg',
    dds: 'test-dxt1.dds',
    stone: 'stone.jpg',
    plaster: 'plaster.jpg',
    wc: 'w_c.jpg',
  };
}

function getUVMap() {
  return {
    bumpMap: 'stone-bump.jpg',
    normalMap: 'plaster-normal.jpg',
    displacementMap: 'w_d.png',
    lightMap: 'lightmap.png',
    aoMap: 'ambient.png',
    roughnessMap: 'roughness-map.jpg',
  };
}

function getGeometries() {
  return {
    box: new BoxGeometry(15, 15, 15),
    sphere: new SphereGeometry(10, 20, 20),
    icosahedron: new IcosahedronGeometry(10, 0),
  };
}

async function addObj() {
  const group = await loadObj('/three/models/baymax/Bigmax_White_OBJ.obj');
  group?.scale.set(0.1, 0.1, 0.1);
  group?.position.set(0, 0, 30);
  const [texture] = await loadTexture(['ambient.png'], '/three/models/baymax/');
  (group?.children as Mesh<BufferGeometry, MeshStandardMaterial>[])
    .filter((mesh) => mesh.name === 'Head')
    .forEach((mesh) => {
      mesh.material.aoMap = texture;
    });

  group && three.add(group);
}

let box: Mesh<BufferGeometry, MeshStandardMaterial>;
const three = useThree();
const load = getTextureLoader('/three/textures/');

const [textureType, textureOptions] = useObjResManage(
  getTextureType(),
  async (current, key) => {
    box.material = await load(
      [current],
      key?.includes('dds') ? 'dds' : 'texture'
    );
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

const [mapType, mapOptions] = useObjResManage(
  getUVMap(),
  async (current, key) => {
    (Object.keys(mapOptions) as typeof key[]).forEach((k) => {
      box.material[k] = null;
    });
    box.material[key] = (await loadTexture([current], '/three/textures/'))[0];
    if (key === 'roughnessMap') {
      box.material.metalnessMap = box.material[key];
    }
    box.material.needsUpdate = true;
  },
  'aoMap'
);
async function init() {
  box = createCubeByGeometry(await load([textureOptions.texture]))(
    geoOptions.box
  );
  box.castShadow = true;
  three.add(box);
  addObj();
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
