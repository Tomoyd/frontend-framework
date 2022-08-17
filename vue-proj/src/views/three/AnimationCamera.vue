<template>
  <div id="three"></div>
  <VFixed>
    <SelectBasic :options="controls" v-model="ctrType" />
  </VFixed>
</template>
<style scoped></style>
<script lang="ts" setup>
import { createCubeByGeometry } from '@/common/three';

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
import { effect, onMounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
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
let remove: () => void;
const firstPerson = () => {
  if (remove) {
    remove();
  }
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

function traceBall() {
  if (remove) {
    remove();
  }
  const controls = new TrackballControls(three.camera, three.dom);
  function update() {
    controls.update();
  }
  remove = three.renderEffectStore.addEffects(update);
  three.loopRender();
}

function pointerLock() {
  const controls = new PointerLockControls(three.camera, document.body);

  // add event listener to show/hide a UI (e.g. the game's menu)

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

const three = useThree();
const { addIntersectObj } = useThreeSelect<Mesh>(three.camera, handleSelected);
function getCameraControls() {
  return {
    orbit: initOrbit,
    first: firstPerson,
    traceBall,
    pointerLock,
  };
}
const [ctrType, controls] = useObjResManage(
  getCameraControls(),
  (fn, obj, key) => {
    if (key === 'orbit') {
      three.stopLoopRender();
      remove?.();
    }
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
