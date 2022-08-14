<template>
  <div>
    <ThreeBasic />
  </div>
</template>

<!-- 三维图像 blender工具 可以导出json格式 -->
<script lang="ts" setup>
import { createCubeByGeometry } from '@/common/three';
import { useThreeContainer } from '@/hooks/useThreeContainer';
import * as THREE from 'three';

import { onMounted } from 'vue';
import ThreeBasic from '../../components/ThreeBasic.vue';
const { BoxGeometry, BufferGeometry, Group, Material, Mesh, SphereGeometry } =
  THREE;
const { three, materialOptions } = useThreeContainer(false);
const createCube = createCubeByGeometry(materialOptions.normal);
function createGroup() {
  const group = new Group();
  const box = createCube(new BoxGeometry(20, 20, 20));
  const sphere = createCube(new SphereGeometry(10, 2, 5));
  box.position.setX(-10);
  sphere.position.setX(10);
  group.add(box);
  group.add(sphere);
  return group;
}

function mergeGeometry(
  meshs: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[]
) {
  return meshs[0];
}

onMounted(() => {
  const mesh = mergeGeometry(
    createGroup().children as THREE.Mesh<THREE.BufferGeometry, THREE.Material>[]
  );

  //   three.renderEffectStore.addEffects(() => {
  //     mesh.rotation.x += 0.01;
  //   });
  //   //   mesh.rotation.y = 30;
  three.add(mesh);
  three.mount();
  //   three.loopRender();
});
</script>
