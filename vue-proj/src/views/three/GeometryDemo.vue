<template>
  <div id="three"></div>
  <div class="selection">
    geometry:
    <SelectBasic :options="geoOptions" v-model="geoType" />
    material:
    <SelectBasic :options="materialOptions" v-model="materialType" />
    <button @click="toggleRotate">toggle rotation</button>
  </div>
</template>
<style>
.selection {
  color: #ee0000;
  left: 10px;
  top: 10px;
  position: fixed;
  background-color: #3d3d3d;
  padding: 10px;
}
.temp {
  color: #ff0000;
}
</style>

<script lang="ts" setup>
import SelectBasic from '@/components/SelectBasic.vue';
import { getObjResManageHooks } from '@/hooks/useObjResManage';

import { useThree } from '@/hooks/useThree';
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  DoubleSide,
  ExtrudeGeometry,
  IcosahedronGeometry,
  LatheBufferGeometry,
  LatheGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Path,
  PlaneGeometry,
  PolyhedronGeometry,
  RingGeometry,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import { onMounted } from 'vue';
/*
 bufferGeometry 只有attribute属性和index属性，提供的内部数据组合形式与GPG所期待的数据结构保持一致，
 提高了运行效率
 attribute 本身是一个分量属性，所存储的信息是会被直接送往GPU处理的，需要借助Float32Array数组，
    每三个数组元素指定一个顶点，每三个顶点确定一个面
 index 可以通过index 去指定组成每一个面的顶点

 Geometry 与 BufferGeometry 相互之间可以 进行转换 fromBufferGeometry fromGeometry
 */

function getMaterials() {
  return {
    basic: new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide }),
    basicWireFrame: new MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
      side: DoubleSide,
    }),
    physical: new MeshPhysicalMaterial({ color: 0xff0000, side: DoubleSide }),
    stardand: new MeshStandardMaterial({ side: DoubleSide }),
    normal: new MeshNormalMaterial({ colorWrite: true, side: DoubleSide }),
  };
}

function createCubeByGeometry(material: Material) {
  return function (geometry: BufferGeometry) {
    return new Mesh(geometry, material);
  };
}

function createShape() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(10, 40);
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
  shape.splineThru([
    new Vector2(32, 30),
    new Vector2(28, 20),
    new Vector2(30, 10),
  ]);
  shape.quadraticCurveTo(20, 15, 10, 10);

  const hole1 = new Path();
  hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole1);

  const hole2 = new Path();
  hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole2);

  const mouth = new Path();
  mouth.absarc(20, 16, 3, 0, Math.PI * 2, true);
  shape.holes.push(mouth);

  return shape;
}

function getGeometries() {
  function generatePoints(len = 20) {
    const points: Vector2[] = [];
    for (let i = 0; i < len; i++) {
      points.push(
        new Vector2(Math.sin(i * 0.2) + Math.cos(i * 0.3) * 5 + 12, i - 15)
      );
    }
    return points;
  }
  return {
    tube: new TubeGeometry(
      new CatmullRomCurve3(
        Array(20)
          .fill(0)
          .map(
            (_) =>
              new Vector3(
                -20 + Math.round(Math.random() * 50),
                -15 + Math.round(Math.random() * 40),
                -20 + Math.round(Math.random() * 40)
              )
          )
      ),
      20,
      1,
      8,
      false
    ),
    lather: new LatheGeometry(generatePoints()),
    extrude: new ExtrudeGeometry(createShape(), {
      depth: 10,
    }),
    plane: new PlaneGeometry(50, 50, 10, 10),

    circle: new CircleGeometry(10, 20, Math.PI / 3, Math.PI),
    ring: new RingGeometry(10, 14, 60, 8, 0, Math.PI * 2),
    shape: new ShapeGeometry(createShape(), 10),
    box: new BoxGeometry(30, 30, 30),
    sphere: new SphereGeometry(
      10,
      20,
      20,
      0,
      Math.PI * 2,
      Math.PI / 2, // y轴 角度是以z为轴线从正到负极角度
      Math.PI
    ),
    cylinder: new CylinderGeometry(-10, 10, 30, 10, 20, true, 0, Math.PI * 2),
    cone: new ConeGeometry(5, 20, 10, 10, false, 0, Math.PI * 2),
    torus: new TorusGeometry(10, 5, 8, 20, Math.PI * 2),
    torusKnot: new TorusKnotGeometry(10, 2, 30, 10, 2, 10),
    polyhedron: new PolyhedronGeometry(
      [1, -1, 2, -10, -10, 1, -10, 10, 20, 1, -10, -10],
      [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
      20,
      0
    ),
    icosahedron: new IcosahedronGeometry(20),
    tetraheadron: new TetrahedronGeometry(15),
    octahedron: new OctahedronGeometry(20),
    dodecahedron: new DodecahedronGeometry(20),
  };
}

function init() {
  const createCubeByBasic = createCubeByGeometry(
    new MeshBasicMaterial({ color: 0xffff00 })
  );
  cube = createCubeByBasic(geoOptions[geoType.value]);
  three.add(cube);
  three.add(new AmbientLight(0xff0000));
  three.mount();
}

function getToggle() {
  let isLoop = false;
  const removeEffects: (() => void)[] = [];
  function toggleRotate() {
    if (isLoop) {
      isLoop = false;
      removeEffects.forEach((f) => f());
      three.stopLoopRender();
      return;
    }
    const remove = three.renderEffectStore.addEffects(() => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.05;
    });
    isLoop = true;
    removeEffects.push(remove);
    three.loopRender();
  }

  return { toggleRotate };
}

const { toggleRotate } = getToggle();
const three = useThree('three');
let cube: Mesh;
const useResManage = getObjResManageHooks({
  afterEffect: () => window.requestAnimationFrame(three.render),
});

const [geoType, geoOptions] = useResManage(
  getGeometries(),
  (current) => {
    cube.geometry = current;
  },
  'plane'
);

const [materialType, materialOptions] = useResManage(
  getMaterials(),
  (current) => {
    cube.material = current;
  },
  'basic'
);

onMounted(() => init());
</script>
