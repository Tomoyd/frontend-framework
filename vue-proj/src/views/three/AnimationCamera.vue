<template>
  <div id="three"></div>
  <VFixed>
    <SelectBasic :options="controls" v-model="ctrType" />
    <div id="stats"></div>
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
  GLTFLoader,
  DRACOLoader,
} from '@/common/three';

import { useThree } from '@/hooks/useThree';
import { useThreeSelect } from '@/hooks/useThreeSelect';
import {
  AmbientLight,
  AnimationMixer,
  // AnimationLoader,
  // AnimationAction,
  // AnimationClip,
  // AnimationMixer,
  AxesHelper,
  BoxGeometry,
  BufferGeometryLoader,
  Clock,
  Color,
  DirectionalLight,
  FileLoader,
  Loader,
  MaterialLoader,
  Mesh,
  MeshNormalMaterial,
  ObjectLoader,
  PointLight,
  type Intersection,
} from 'three';
import { onMounted } from 'vue';

import { tweenAnimate } from '@/common';
import SelectBasic from '@/components/SelectBasic.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import VFixed from '@/components/ui/VFixed.vue';
import Stats from 'three/examples/jsm/libs/stats.module';
// Raycaster 物体选中
function handleOne({ object: mesh }: Intersection<Mesh>) {
  const { y } = mesh.rotation;

  tweenAnimate({ y }, { y: y + Math.PI }, ({ y }) => {
    mesh.rotation.y = y;
    // window.requestAnimationFrame(three.render);
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
  const controls = new OrbitControls(three.camera, three.dom);

  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.addEventListener('change', () => {
    if (ctrType.value !== 'orbit') {
      controls.enabled = false;
      controls.dispose();
      return;
    }
    window.requestAnimationFrame(controls.update);
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

// 核心动画类
// AnimationClip;
// AnimationMixer;
// AnimationAction;

function loadHorse() {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/three/gltf/');
  loader.setDRACOLoader(dracoLoader);
  loader.load('/LittlestTokyo.glb', function (gltf) {
    const model = gltf.scene;

    model.position.set(1, 1, 0);
    model.scale.set(0.05, 0.05, 0.05);
    three.add(model);
    const mixer = new AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    const clock = new Clock();
    three.renderEffectStore.addEffects(() => {
      const delta = clock.getDelta();

      mixer.update(delta);
    });
  });
}

function addBox() {
  const createCube = createCubeByGeometry(
    new MeshNormalMaterial({ wireframe: false })
  );
  const box = createCube(new BoxGeometry(5, 10, 20));
  box.position.setZ(-20);
  addIntersectObj(box);
  three.add(box);
}

function initStats() {
  const stats = Stats();
  // stats.showPanel(0);
  // stats.begin();
  three.renderEffectStore.addEffects(() => stats.update());
  return stats;
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
  loadHorse();
  addBox();
  const { dom } = initStats();
  document.getElementById('stats')?.appendChild(dom);
  three.add(new AxesHelper(30));
  const light = new AmbientLight(new Color(0xffffff), 1);
  light.position.set(0, 0, 0);
  light.lookAt(0, 0, 0);
  three.add(light);
  three.mount();
  three.loopRender();
});
</script>
