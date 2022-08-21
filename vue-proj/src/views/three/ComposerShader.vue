<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="100" :top="5">
    <SelectBasic :options="passOptions" v-model="passType" />
  </VFixed>
</template>
<style></style>
<script lang="ts" setup>
import {
  BloomPass,
  CopyShader,
  createCubeByGeometry,
  DotScreenPass,
  EffectComposer,
  FilmPass,
  loadTexture,
  RenderPass,
  ShaderPass,
} from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import { useObjResManage } from '@/hooks/useObjResManage';
import { useThree } from '@/hooks/useThree';
import type { Void } from '@/types';

import { AmbientLight, MeshPhongMaterial, SphereGeometry } from 'three';

import { onMounted } from 'vue';
import SelectBasic from '@/components/SelectBasic.vue';
function passFns() {
  const passFns = {
    filmPass() {
      const filmPass = new FilmPass(0.2, 0.3, 256, 0);
      filmPass.renderToScreen = true;
      return filmPass;
    },
    bloomPass() {
      const pass = new BloomPass();
      return pass;
    },
    shaderPass() {
      const pass = new ShaderPass(CopyShader);
      pass.renderToScreen = true;
      return pass;
    },
    dotScreenPass() {
      const pass = new DotScreenPass();
      return pass;
    },
  };
  return passFns;
}

async function addEarth() {
  const [map] = await loadTexture(['Earth.png'], '/three/textures/earth/');
  const earth = createCubeByGeometry(
    new MeshPhongMaterial({
      map: map,
      color: 0xffffff, // 定义发光的颜色, 光照上后显示的颜色，再与自发光结合
      emissive: 0x000000, // 自发光的颜色
    })
  )(new SphereGeometry(10));
  three.add(earth);
  effectComposer.addEffects(() => {
    earth.rotation.y += 0.01;
  });
}

function createEffects<T extends Void>() {
  const renderEffects: T[] = [];
  function addEffects(fn: T) {
    renderEffects.push(fn);
  }
  function removeEffects(fn: T) {
    renderEffects.splice(renderEffects.indexOf(fn), -1);
  }
  return {
    renderEffects,
    addEffects,
    removeEffects,
  };
}

function createComposer() {
  const composer = new EffectComposer(three.getRenderer());
  composer.addPass(new RenderPass(three.getScene(), three.camera));
  const effectsManage = createEffects();
  const renderEffects = effectsManage.renderEffects;

  function composerRender(times: number) {
    renderEffects.forEach((f) => f());
    window.requestAnimationFrame(composerRender);
    composer.render(times);
  }

  composerRender(0);

  return {
    ...effectsManage,
    composer,
  };
}

const three = useThree();
const effectComposer = createComposer();
const passCache = new Map();

const [passType, passOptions] = useObjResManage(
  passFns(),
  (current, key) => {
    if (passCache.get(key)) {
      return;
    }
    const pass = current();
    passCache.set(key, pass);
    effectComposer.composer.addPass(pass);
  },
  'filmPass'
);
onMounted(async () => {
  addEarth();
  three.mount();
  three.add(new AmbientLight(0xffffff, 1));
});
</script>
