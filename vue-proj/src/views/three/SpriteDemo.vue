<template>
  <div>
    <ThreeBasic>
      <button @click="addPoint">addPoint</button>
    </ThreeBasic>
  </div>
</template>

<script lang="ts" setup>
import ThreeBasic from '@/components/ThreeBasic.vue';
import { useThreeContainer } from '@/hooks/useThreeContainer';

import {
  SpriteMaterial,
  Points,
  MathUtils,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Sprite,
  Color,
} from 'three';
function createPointsGeometry() {
  const vertices = [];
  const colors = [];
  const colorArray = [
    new Color(0xff0080),
    new Color(0xffffff),
    new Color(0x8000ff),
  ];
  for (let i = 0; i < 10000; i++) {
    const x = MathUtils.randFloatSpread(100);
    const y = MathUtils.randFloatSpread(100);
    const z = MathUtils.randFloatSpread(100);

    vertices.push(x, y, z);

    const clr = colorArray[Math.floor(Math.random() * colorArray.length)];

    colors.push(clr.r, clr.g, clr.b);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  return geometry;
}
const { materialOptions, geoOptions, geoType, three } = useThreeContainer();

const spriteMaterial = new PointsMaterial({
  //   color: 0xff0000,
  side: 30,
  sizeAttenuation: true,
  vertexColors: true,
  depthTest: true,
});

const points = new Points(createPointsGeometry(), spriteMaterial);

function addPoint() {
  three.add(points);
  //   if (points) {
  //     points.geometry.setAttribute(
  //       'color',
  //       new Float32BufferAttribute([1, 0, 0], 3)
  //     );
  //   }

  window.requestAnimationFrame(three.render);
}
</script>
