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
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshLambertMaterial,
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
      box.material.roughness = 0.05;
    },
    async roughnessMap() {
      const [map] = await loadTexture(
        ['roughness-map.jpg'],
        '/three/textures/'
      );

      box.material.roughnessMap = map;

      box.material.metalness = 1;
      box.material.roughness = 0.4;
    },
    async metalnessMap() {
      const [map] = await loadTexture(
        ['roughness-map.jpg'],
        '/three/textures/'
      );

      box.material.metalnessMap = map;

      box.material.metalness = 1;
      box.material.roughness = 0.04;
    },
    async envMap() {
      const { cubeCamera } = createCubeCamera();
      // box.material.envMap = createCubeTexture('car');
      box.material.envMap = cubeCamera.renderTarget.texture;
      cubeCamera.position.copy(box.position);
      box.material.metalness = 1;
      box.material.roughness = 0.01;
      cubeCamera.update(three.getRenderer(), three.getScene());
    },
    async displacementMap() {
      const [map, displacementMap] = await loadTexture(
        ['w_c.jpg', 'w_d.png'],
        '/three/textures/'
      );
      box.material.map = map;
      box.material.displacementMap = displacementMap;
    },
    async bumpMap() {
      const [map, bumpMap] = await loadTexture(
        ['stone.jpg', 'stone-map.png'],
        '/three/textures/'
      );
      box.material.map = map;
      box.material.bumpMap = bumpMap;
    },
    async normalMap() {
      const [map, normalMap] = await loadTexture(
        ['plaster.jpg', 'plaster-normal.jpg'],
        '/three/textures/'
      );
      box.material.map = map;
      box.material.aoMap = normalMap;
    },
    async aoMap() {
      const [aomap] = await loadTexture(['ambient.png'], '/three/textures/');
      box.material.aoMap = aomap;
    },
    async lightMap() {
      const [lightMap] = await loadTexture(
        ['lightmap.png'],
        '/three/textures/'
      );
      box.material.lightMap = lightMap;
    },
    async alphaMap() {
      await this.map();
      box.material.metalness = 0.02;
      box.material.roughness = 0.07;
      box.material.alphaTest = 0.5;
      box.material.side = DoubleSide;
    },
    async map() {
      box.material[
        mapType.value as Exclude<keyof typeof mapFn, 'specularMap'>
      ] = (
        await loadTexture(
          [textureOptions[textureType.value]],
          '/three/textures/'
        )
      )[0];
    },
  };
  return mapFn;
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

function addCubeCamera() {
  const { cube, cubeCamera } = createCubeCamera();
  cube.position.set(-30, 20, 0);
  cubeCamera.position.copy(cube.position);
  three.add(cube);
  const renderer = three.getRenderer();
  const scene = three.getScene();
  three.renderEffectStore.addEffects(() => {
    cubeCamera.update(renderer, scene);
  });
}

async function addBox() {
  box = createCubeByGeometry(
    await loadStandMaterialByTexture([textureOptions.texture])
  )(geoOptions.box);
  box.castShadow = true;
  box.position.set(0, 0, 20);
  const uvs = box.geometry.getAttribute('uv') as BufferAttribute;
  // set进行更改
  uvs.set([0.5, 0.5, 0.5], 0);
  three.add(box);
}
let box: Mesh<BufferGeometry, MeshStandardMaterial>;
const three = useThree();
const loadStandMaterialByTexture = getTextureLoader('/three/textures/');

const [textureType, textureOptions] = useObjResManage(
  getTextureType(),
  async (current, key) => {
    box.material.map = (
      await loadTexture(
        [current],
        '/three/textures/',
        key?.includes('dds') ? 'dds' : 'texture'
      )
    )[0];
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
  async (current) => {
    await current();
    box.material.needsUpdate = true;
  },
  'map'
);

async function init() {
  addObj();
  addCubeCamera();
  addBox();
  three.add(new AmbientLight(0x444444));
  three.add(createGroundPlane());
  three.add(createSpotLight());
  three.setBackground(createCubeTexture('car'));
  three.mount();
  three.loopRender();
}

onMounted(() => {
  init();
});
</script>
