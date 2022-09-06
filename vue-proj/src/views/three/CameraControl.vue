<template>
  <div id="three"></div>
  <div id="stats"></div>
</template>
<style></style>
<script lang="ts" setup>
import { tweenAnimate } from '@/common';
import { useWindowListener } from '@/hooks/useListener';
import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';

import {
  AxesHelper,
  Box3,
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
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

const { addIntersectObj } = useThreeSelect<Mesh>(
  three.camera,
  (intersections) => {
    if (intersections.length <= 0) return;
    const obj = intersections[0].object;

    // const boxZ = new Box3().setFromObject(obj).max.z;
    const distance = 20;
    const theta = obj.rotation.y;

    const targetPosition = {
      x: obj.position.x + Math.sin(theta) * distance,
      y: obj.position.y,
      z: obj.position.z + Math.cos(theta) * distance,
    };

    three.orbit.enabled = false;

    tweenAnimate(
      three.camera.position.clone(),
      targetPosition,
      ({ x, y, z }) => {
        three.camera.position.set(x, y, z);
      },
      2000
    );
    tweenAnimate(
      three.orbit.target,
      obj.position,
      () => {
        console.log('1', 1);
      },
      2000,
      () => {
        three.orbit.enabled = true;
      }
    );
  }
);

useWindowListener(window, 'resize', three.resize);

onMounted(() => {
  addBox();
  three.mount();
  three.loopRender();
  three.add(new AxesHelper(30));
});
</script>
