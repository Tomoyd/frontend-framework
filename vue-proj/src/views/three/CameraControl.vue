<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="100" :top="5">
    <div style="color: #fff">点击物体进行视图锁定</div>
  </VFixed>
</template>
<style></style>
<script lang="ts" setup>
import { tweenAnimate } from '@/common';
import VFixed from '@/components/ui/VFixed.vue';
import { useWindowListener } from '@/hooks/useListener';
import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';

import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';
const three = useThree();

const addBox = () => {
  const geometry = new BoxGeometry(5, 5, 5);
  const box = new Mesh(geometry, new MeshBasicMaterial({ color: 0xff0000 }));

  const yRotation = Math.PI / 3;
  let i = 60;
  const group = new Group();
  while (i > 0) {
    const newCube = box.clone();

    const position = Array(3)
      .fill(0)
      .map(() => (Math.random() > 0.5 ? -1 : 1) * Math.random() * 40) as [
      number,
      number,
      number
    ];
    newCube.position.set(...position);
    newCube.material = box.material.clone();
    newCube.material.color.setRGB(Math.random(), Math.random(), Math.random());
    newCube.rotation.y = Math.random() * yRotation;
    group.add(newCube);
    i--;
  }

  addIntersectObj(group.children as Mesh[]);
  three.add(group);
};

const handleSelected = (intersections: Intersection<Mesh>[]) => {
  if (intersections.length <= 0) return;
  const obj = intersections[0].object;
  const distance = 20;
  const theta = obj.rotation.y;
  const cameraPosition = three.camera.position;
  const targetPosition = {
    x: obj.position.x + Math.sin(theta) * distance,
    y: obj.position.y,
    z: obj.position.z + Math.cos(theta) * distance,
  };

  three.orbit.enabled = false;

  tweenAnimate(cameraPosition, targetPosition, undefined, 2000);
  tweenAnimate(three.orbit.target, obj.position, undefined, 2000, () => {
    three.orbit.enabled = true;
  });
};

const { addIntersectObj } = useThreeSelect<Mesh>(three.camera, handleSelected);

useWindowListener(window, 'resize', three.resize);

onMounted(() => {
  addBox();
  three.mount();
  three.loopRender();
  three.camera.far = 100;
  const cameraPosition = three.camera.position;
  cameraPosition.set(0, 0, 0);
  tweenAnimate(cameraPosition, new Vector3(0, 0, 60), undefined, 2000);
});
</script>
