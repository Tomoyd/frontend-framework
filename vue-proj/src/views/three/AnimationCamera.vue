<template>
  <div id="three"></div>
</template>
<style></style>
<script lang="ts" setup>
import { createCubeByGeometry } from '@/common/three';

import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { tweenAnimate } from '@/common';

function handleOne({ object: mesh }: Intersection<Mesh>) {
  const { y } = mesh.rotation;

  tweenAnimate({ y }, { y: y + Math.PI }, ({ y }) => {
    mesh.rotation.y = y;
    console.log(y);
    window.requestAnimationFrame(three.render);
  });
}

function handleSelected(intersections: Intersection<Mesh>[]) {
  if (!intersections.length) {
    return;
  }
  intersections.forEach(handleOne);
}

function initOrbit() {
  const orbit = new OrbitControls(three.camera, three.dom);
  orbit.autoRotate = true;
  orbit.addEventListener('change', () => {
    window.requestAnimationFrame(orbit.update);
    window.requestAnimationFrame(three.render);
  });
}

const three = useThree();
const { addIntersectObj } = useThreeSelect<Mesh>(three.camera, handleSelected);

onMounted(() => {
  //   initOrbit();
  const createCube = createCubeByGeometry(
    new MeshNormalMaterial({ wireframe: false })
  );

  const sphere = createCube(new BoxGeometry(5, 10, 20));
  sphere.position.setZ(-20);
  addIntersectObj(sphere);

  three.add(sphere);
  three.add(new AxesHelper(30));
  three.mount();
});
</script>
