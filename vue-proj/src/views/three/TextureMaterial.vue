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
  createCubeTexture,
  createCubeCamera,
} from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import { useThree } from '@/hooks/useThree';
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  BufferGeometryLoader,
  CubeCamera,
  DoubleSide,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Texture,
  Vector2,
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
    alphaMap: 'alpha.png',
    emissiveMap: 'lava.png',
    specularMap: '',
    //  emissiveMap  specularMap ,envMap
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

const mapFn = {
  async specularMap() {
    const [map, normalMap, specularMap] = await loadTexture(
      ['Earth.png', 'EarthNormal.png', 'EarthSpec.png'],
      '/three/textures/earth/'
    );
    (box.material as Material) = new MeshPhongMaterial({
      map,
      normalMap,
      specularMap,
      normalScale: new Vector2(6, 6),
      shininess: 10,
      specular: 0xffff00,
    });
  },
  async emissiveMap() {
    const [emissiveMap, normalMap, metalnessMap] = await loadTexture(
      ['lava.png', 'lava-normals.png', 'lava-smoothness.png'],
      '/three/textures/emissive/'
    );

    box.material.emissiveMap = emissiveMap;
    box.material.normalMap = normalMap;
    box.material.metalnessMap = metalnessMap;
    box.material.metalness = 1;
    box.material.roughness = 0.4;
  },
  async roughnessMap() {
    box.material.metalness = 1;
    const [map] = await loadTexture(['roughness-map.jpg'], '/three/textures/');
    box.material.metalnessMap = map;
    box.material.roughnessMap = map;
    box.material.roughness = 0.4;
    window.requestAnimationFrame(() => {
      box.material.envMap = createCubeTexture('car');
    });
  },
  async aoMap() {
    const [map, aoMap] = await loadTexture(
      ['stone.jpg', 'stone-map.jpg'],
      '/three/textures/'
    );
    box.material.map = map;
    box.material.aoMap = aoMap;
  },
  async lightMap() {
    const [lightMap] = await loadTexture(['lightmap.png'], '/three/textures/');
    box.material.lightMap = lightMap;
  },
  async alphaMap() {
    await this.loadMap();
    box.material.metalness = 0.02;
    box.material.roughness = 0.07;
    box.material.alphaTest = 0.5;
    box.material.side = DoubleSide;
  },
  async loadMap() {
    if (mapType.value === 'specularMap') {
      return;
    }
    box.material[mapType.value] = (
      await loadTexture([mapOptions[mapType.value]], '/three/textures/')
    )[0];
  },
};

function addCubeCamera() {
  const { cube, cubeCamera } = createCubeCamera();
  cube.position.set(-30, 20, 0);
  cubeCamera.position.copy(cube.position);
  three.add(cube);

  three.renderEffectStore.addEffects(() => {
    cubeCamera.update(three.getRenderer(), three.getScene());
  });
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
    (Object.keys(mapOptions) as typeof key[])
      .filter((item) => item !== 'specularMap')
      .forEach((k) => {
        box.material[k as Exclude<typeof k, 'specularMap'>] = null;
      });
    if (!key.includes('Map')) {
      mapFn.loadMap();
      return;
    }

    await mapFn[key as 'alphaMap']?.();
    box.material.needsUpdate = true;
  },
  'aoMap'
);

async function init() {
  box = createCubeByGeometry(await load([textureOptions.texture]))(
    geoOptions.box
  );
  box.castShadow = true;
  box.position.set(0, 0, 20);
  three.add(box);
  addObj();
  addCubeCamera();
  three.add(new AmbientLight(0x444444));
  three.add(createGroundPlane());
  three.add(createSpotLight());
  three.mount();
  three.setBackground(createCubeTexture('car'));
  three.loopRender();
}

onMounted(() => {
  init();
});
</script>
