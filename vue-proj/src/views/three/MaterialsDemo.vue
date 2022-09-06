<template>
  <div class="selection" @change="onChange">
    <select v-model="meshOption">
      <option
        v-for="(_, key) in meshOptions"
        :name="key"
        :key="key"
        :value="key"
      >
        {{ key }}
      </option>
    </select>
    <select v-model="lineOption" @change="onChangeLine">
      <option
        v-for="(_, key) in lineOptions"
        :name="key"
        :key="key"
        :value="key"
      >
        {{ key }}
      </option>
    </select>
  </div>
  <div id="three"></div>
</template>

<style scoped>
.selection {
  color: #ee0000;
  left: 10px;
  top: 10px;
  position: fixed;
  background-color: #3d3d3d;
  padding: 10px;
}
</style>

<script lang="ts" setup>
import {
  createLineGeometry,
  createMultiMaterialObject,
  customGeometry,
  useThree,
} from '@/hooks/useThree';
import * as THREE from 'three';
import { Group, Mesh } from 'three';
import { onMounted, ref } from 'vue';

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

  // 随机生成自然颜色
  const normal = new THREE.MeshNormalMaterial();

  // 高级材质

  THREE.MeshLambertMaterial; // 产生暗淡并不光亮的表面，对于场景中的光源产生反应
  THREE.MeshPhongMaterial, THREE.MeshToonMaterial; // 其他和lamber一致，不同的是可以指定高亮的颜色
  THREE.ShaderMaterial; // 着色器

  const lamber = new THREE.MeshLambertMaterial({
    color: 0xff0000, // 光源时显示的颜色， 会与环境光混合
    emissive: 0x0000ff, // 没有光源时自己发出的颜色,有的时候进行与color混合
    wireframe: false,
  });

  //
  const phong = new THREE.MeshPhongMaterial({
    color: 0x7777ff, // 与自然光混合 相乘
    // emissive: 0xffffff, // 如果设置有无，光源时自己发出的颜色
    specular: 0xffffff, //高光色
    shininess: 60, // 高光度,
    // wireframe: true,
  });

  // 更接近物理
  THREE.MeshPhysicalMaterial;
  THREE.MeshStandardMaterial;

  const physical = new THREE.MeshPhysicalMaterial({
    color: 0xffff00,
    // emissive: 0x00ff00,
    clearcoat: 0.7,
    clearcoatRoughness: 0.6,
    reflectivity: 0.7,
    metalness: 0.6, // 0-1
    roughness: 0.0, //0-1
  });
  const standard = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    // emissive: 0x00ff00,

    metalness: 0.6, // 0-1
    roughness: 0.0, //0-1
  });

  const shader = new THREE.ShaderMaterial();

  return {
    basic,
    depth,
    normal,
    lamber,
    phong,
    physical,
    standard,
    shader,
  };
}

function lineMaterials() {
  const lineDashed = new THREE.LineDashedMaterial({
    color: 0xffff00,
    linewidth: 3,
    gapSize: 3,
    scale: 1.5,
  });

  const lineBasic = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 3,
  });

  return { lineBasic, lineDashed };
}
function createCube(
  material: THREE.Material | THREE.Material[] = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }),
  geometry?: THREE.ShapeGeometry | THREE.BufferGeometry
) {
  if (!geometry) {
    geometry = new THREE.BoxGeometry(10, 10, 10);
  }

  return new Mesh(geometry, material);
}

function createMagic(n = 3) {
  const group = new Group();
  const materials = [
    0xff0000, 0xffff00, 0xff00ff, 0x00ff00, 0x0000ff, 0x00ffff,
  ].map((item) => new THREE.MeshBasicMaterial({ color: item }));
  const geometry = new THREE.BoxGeometry(2.9, 2.9, 2.9);
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const cube = createCube(materials, geometry);
        cube.position.set(x * 3, y * 3, z * 3);
        group.add(cube);
      }
    }
  }
  return group;
}

function init() {
  const materials = meshOptions;
  const group = createMultiMaterialObject(new THREE.BoxGeometry(10, 10, 10), [
    materials.basic,
    materials.depth,
  ]);
  group.children[1].scale.set(0.9, 0.9, 0.9);
  three.add(group);

  const sphere = createCube(materials.normal, new THREE.SphereGeometry(5));
  sphere.position.set(-40, 0, 0);
  three.add(sphere);

  const magic = createMagic();
  magic.position.setX(40);
  three.add(magic);

  cube = createCube(materials.basic);
  cube.position.setX(-12);
  three.add(cube);

  line = new THREE.Line(
    createLineGeometry([
      [-10, -20, 0],
      [20, 5, 5],
    ]),
    new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 3,
    })
  );

  three.add(line);

  three.add(new THREE.AmbientLight(0xffffff)); // 受光照影响将显示黄色
}
const meshOptions = simpleMaterials();
const lineOptions = lineMaterials();
// const materialTypes = Object.keys(materials);

const three = useThree('three');
const meshOption = ref<keyof typeof meshOptions>('basic');
const lineOption = ref<keyof typeof lineOptions>('lineBasic');

let cube: THREE.Mesh;
let line: THREE.Line;
function onChange() {
  cube.material = meshOptions[meshOption.value];
  window.requestAnimationFrame(three.render);
}

function onChangeLine() {
  line.material = lineOptions[lineOption.value];
  if (lineOption.value === 'lineDashed') {
    line.computeLineDistances();
  }

  three.render();
}
onMounted(() => init());
</script>
