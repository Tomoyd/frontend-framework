<template>
  <div id="three"></div>
  <div id="stats"></div>
</template>
<style></style>
<script lang="ts" setup>
import { tweenAnimate } from '@/common';
import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import {
  AxesHelper,
  Box3,
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
} from 'three';
import { onMounted } from 'vue';
const three = useThree();

const addBox = () => {
  const geometry = new BoxGeometry(10, 10, 10);
  const box = new Mesh(
    geometry,
    new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide })
  );
  box.position.set(-25, 10, -20);
  addIntersectObj(box);
  three.add(box);
};

const { addIntersectObj } = useThreeSelect<Mesh>(
  three.camera,
  (intersections) => {
    if (intersections.length <= 0) return;
    const obj = intersections[0].object;

    const boxZ = new Box3().setFromObject(obj).max.x;

    three.orbit.enabled = false;
    console.log(three.camera.position, obj.position);
    const targetPosition = {
      x: obj.position.x,
      y: obj.position.y,
      z: obj.position.z + 15,
    };
    tweenAnimate(
      three.camera.position.clone(),
      targetPosition,
      ({ x, y, z }) => {
        three.camera.position.set(x, y, z);
        three.orbit.target.set(x, y, z);
      },
      2000
    );
  }
);

onMounted(() => {
  addBox();
  three.mount();
  three.loopRender();
  three.add(new AxesHelper(30));
});
</script>
