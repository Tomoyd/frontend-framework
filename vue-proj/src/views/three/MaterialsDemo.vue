<template>
  <div id="three"></div>
</template>

<script lang="ts" setup>
import { createMultiMaterialObject, useThree } from '@/hooks/useThree';
import * as THREE from 'three';
import { Mesh } from 'three';
import { onMounted } from 'vue';
const three = useThree('three');

/*
基础属性
材质都继承与THREE.Material
基础属性：
如id uuid  name transparent  opacity visible colorWrite(是否输出颜色)
等
融合属性 blendXXX 一系列的
高级属性：
    precision 控制精度
    alphatest 如果某个像素点alpha小于该值，不会显示出来，用来去除毛边[0,1]
    polygonXXX 相关的
    depthWrite  深度缓存，测试相关的，如果是二维的可以不需要
    depthTest
    depthFunc
 */

/**
 * 简单的网格材质
 */

THREE.MeshBasicMaterial;
THREE.MeshDepthMaterial;
THREE.MeshNormalMaterial;

function simpleMaterials() {
  const basic = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    name: 'basic-1',
    transparent: true,
    opacity: 1,
    // // vertexColors:,
    // side: THREE.DoubleSide,
    blending: THREE.MultiplyBlending,
    // // wireframe: true,
    // // wireframeLinecap: 'square', // 线段端点  round butt square
    // wireframeLinewidth: 2.0, // 由于OpenGL 支持问题很多只会显示 1
    // // wireframeLinejoin: 'miter', // 线段的连接点
  });

  // 不由光照决定， 由物体到摄像及的距离决定
  const depth = new THREE.MeshDepthMaterial({
    // opacity: 0.61,
    // wireframe: true,
    // wireframeLinewidth: 2, // 只有THREE.CanvasRender 有效
  });

  const normal = new THREE.MeshNormalMaterial();

  return { basic, depth, normal };
}
function createCube<T extends THREE.Material>(
  material: T,
  geometry?: THREE.ShapeGeometry
) {
  if (!geometry) {
    geometry = new THREE.BoxGeometry(30, 30, 30);
  }

  return new Mesh(geometry, material);
}
onMounted(() => {
  const materials = simpleMaterials();

  const cube = createCube(materials.basic);

  three.add(cube);

  const group = createMultiMaterialObject(new THREE.BoxGeometry(30, 30, 30), [
    materials.basic,
    materials.depth,
    // materials.normal,
  ]);
  group.children[1].scale.set(0.9, 0.9, 0.9);

  const sphere = createCube(materials.normal, new THREE.SphereGeometry(15));
  sphere.position.set(-40, 0, 0);

  const newCube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    [0xff0000, 0xffff00, 0xff00ff, 0xff00ff, 0xff0000, 0xff00ff].map(
      (item) => new THREE.MeshBasicMaterial({ color: item })
    )
  );

  newCube.position.setX(40);

  three.add(newCube);

  three.add(sphere);
  three.add(group);
});
</script>
