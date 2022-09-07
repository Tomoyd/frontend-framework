<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="100" :top="5" style="opacity: 0.5; border-radius: 2px">
    <div style="color: #fff; font-size: 10px">点击物体进行视图锁定</div>
  </VFixed>
</template>
<style></style>
<script lang="ts" setup>
import { getRandomNumber, tweenAnimate } from '@/common';
import { loadObj } from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import { useWindowListener } from '@/hooks/useListener';
import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import type { PointArg } from '@/types';

import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Vector3,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';
const three = useThree();
const vector = new Vector3();
const objCenters = {
  bigWhite: vector,
};

const addBox = () => {
  const geometry = new BoxGeometry(5, 5, 5);
  const box = new Mesh(geometry, new MeshBasicMaterial({ color: 0xff0000 }));

  const yRotation = Math.PI / 3;
  let i = 60;
  const group = new Group();
  const array = [40, 40, 40];
  while (i > 0) {
    const newCube = box.clone();
    newCube.position.set(...(array.map(getRandomNumber) as PointArg));
    newCube.material = box.material.clone();
    newCube.material.color.setRGB(Math.random(), Math.random(), Math.random());
    newCube.rotation.y = Math.random() * yRotation;
    group.add(newCube);
    i--;
  }

  addIntersectObj(group.children as Mesh[]);
  three.add(group);
};

const handleSelected = (intersections: Intersection[]) => {
  if (intersections.length <= 0) return;
  const obj = intersections[0].object as Mesh;
  const distance = 20;
  const theta = obj.rotation.y || obj.parent?.rotation.y || 0;
  vector.copy(obj.position);
  if (obj.name) {
    // obj.geometry.computeBoundingBox();
    // const { min, max } = obj.geometry.boundingBox as Box3;
    // const { min, max } = new Box3().setFromObject(obj);
    // vector.set(0, 0, 0).addVectors(min, max).multiplyScalar(0.5);
    // .applyMatrix4(obj.matrixWorld);

    vector.copy(objCenters.bigWhite);
    console.log('vector', vector);
  }

  const targetPosition = {
    x: vector.x + Math.sin(theta) * distance,
    y: vector.y,
    z: vector.z + Math.cos(theta) * distance,
  };

  three.orbit.enabled = false;
  tweenAnimate(three.camera.position, targetPosition, undefined, 2000);
  tweenAnimate(three.orbit.target, vector, undefined, 2000, () => {
    three.orbit.enabled = true;
  });
};

const addObj = async () => {
  const group = await loadObj('./three/models/baymax/Bigmax_White_OBJ.obj');
  if (!group) return;
  group.children.forEach((item) => {
    (item as Mesh<BufferGeometry, MeshPhongMaterial>).material.emissive.set(
      0xeeeeee * Math.random()
    );
  });
  group.scale.set(0.1, 0.1, 0.1);
  group.rotation.y = (Math.random() * Math.PI) / 2;
  addIntersectObj(group);
  three.add(group);
  group.updateMatrixWorld();
  three.getScene().updateMatrixWorld(true);
  const box = new Box3().setFromObject(group);
  vector.set(0, 0, 0).addVectors(box.min, box.max).multiplyScalar(0.5);

  objCenters.bigWhite = vector.clone();
};

const { addIntersectObj } = useThreeSelect<Mesh | Group>(
  three.camera,
  handleSelected
);

useWindowListener(window, 'resize', three.resize);

onMounted(() => {
  addBox();
  addObj();
  three.mount();
  three.loopRender();
  three.camera.far = 100;
  const cameraPosition = three.camera.position;
  cameraPosition.set(0, 0, 0);

  tweenAnimate(cameraPosition, new Vector3(0, 0, 60), undefined, 2000);
});
</script>
