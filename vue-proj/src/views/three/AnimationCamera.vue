<template>
  <div id="three"></div>
</template>
<style></style>
<script lang="ts" setup>
import { createCubeByGeometry } from '@/common/three';

import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import {
  Mesh,
  MeshNormalMaterial,
  PlaneGeometry,
  SphereGeometry,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';
import TWEEN from '@tweenjs/tween.js';
const three = useThree();

function getAnimate() {
  let animateNumber = 0;
  return function animate(time: number) {
    animateNumber = requestAnimationFrame(animate);

    TWEEN.update(time);
    return () => {
      cancelAnimationFrame(animateNumber);
    };
  };
}

function handleOne({ object: mesh }: Intersection<Mesh>) {
  const stop = getAnimate()(0);
  const { x } = mesh.position;
  new TWEEN.Tween({ x })
    .to({ x: x + 20 }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ x }) => {
      mesh.position.setX(x);
      window.requestAnimationFrame(three.render);
    })
    .onComplete(() => {
      stop();
    })
    .start();
}

function handleSelected(intersections: Intersection<Mesh>[]) {
  console.log('intersections', intersections);
  if (!intersections.length) {
    return;
  }

  intersections.forEach(handleOne);
}

const { addIntersectObj } = useThreeSelect<Mesh>(three.camera, handleSelected);

onMounted(() => {
  const createCube = createCubeByGeometry(new MeshNormalMaterial());
  const plane = createCube(new PlaneGeometry(20, 30));
  addIntersectObj(plane);
  three.add(plane);

  const sphere = createCube(new SphereGeometry(5, 10, 10));
  sphere.position.setX(-30);
  addIntersectObj(sphere);
  three.add(sphere);

  three.mount();
});
</script>
