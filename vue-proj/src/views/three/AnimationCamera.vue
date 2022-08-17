<template>
  <div id="three"></div>
  <VFixed>
    <SelectBasic :options="controls" v-model="ctrType" />
  </VFixed>
</template>
<style scoped></style>
<script lang="ts" setup>
import {
  createCubeByGeometry,
  FirstPersonControls,
  OrbitControls,
  PointerLockControls,
  TrackballControls,
} from '@/common/three';

import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Mesh,
  MeshNormalMaterial,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';

import { tweenAnimate } from '@/common';
import SelectBasic from '@/components/SelectBasic.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import VFixed from '@/components/ui/VFixed.vue';

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

function getFirstControls() {
  let remove = () => {
    return;
  };
  const firstPerson = () => {
    const control = new FirstPersonControls(three.camera);

    control.movementSpeed = 1;
    control.lookSpeed = 0.1;
    control.lookAt(0, 0, 0);
    const clock = new Clock();
    function update() {
      control.update(clock.getDelta());
    }
    remove = three.renderEffectStore.addEffects(update);
    three.loopRender();
  };

  return [firstPerson, remove];
}
function getTraceBall() {
  let remove = () => {
    return;
  };
  function traceBall() {
    const controls = new TrackballControls(three.camera, three.dom);
    function update() {
      controls.update();
    }
    remove = three.renderEffectStore.addEffects(update);
    three.loopRender();
  }
  return [traceBall, remove];
}
function initOrbit() {
  const orbit = new OrbitControls(three.camera, three.dom);
  orbit.autoRotate = true;
  orbit.addEventListener('change', () => {
    if (ctrType.value !== 'orbit') {
      orbit.enabled = false;
      orbit.dispose();
      return;
    }
    window.requestAnimationFrame(orbit.update);
    window.requestAnimationFrame(three.render);
  });
}
function pointerLock() {
  const controls = new PointerLockControls(three.camera, document.body);

  controls.addEventListener('lock', function () {
    //
  });

  controls.addEventListener('unlock', function () {
    //
  });
  three.add(controls.getObject());
  three.render();
  controls.lock();
}

const [first, removeFirst] = getFirstControls();
const [traceBall, removeTraceBall] = getTraceBall();
const three = useThree();
const { addIntersectObj } = useThreeSelect<Mesh>(three.camera, handleSelected);

function getCameraControls() {
  return {
    orbit: initOrbit,
    first,
    traceBall,
    pointerLock,
  };
}
const [ctrType, controls] = useObjResManage(
  getCameraControls(),
  (fn) => {
    removeFirst();
    removeTraceBall();
    fn();
  },
  'orbit'
);

onMounted(() => {
  initOrbit();
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
