<template>
  <div id="three"></div>
  <div id="stats"></div>
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
  TexturePass,
} from '@/common/three';

import { useThree } from '@/hooks/useThree';
import type { Void } from '@/types';

import { AmbientLight, MeshPhongMaterial, SphereGeometry } from 'three';

import { onMounted } from 'vue';

function passFns() {
  const passFns = {
    filmPass() {
      const filmPass = new FilmPass(0.2, 0.3, 256, 0);
      filmPass.renderToScreen = true;
      return filmPass;
    },
    bloomPass() {
      const pass = new BloomPass();
      pass.renderToScreen = true;
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

function initComposer() {
  const renderer = three.getRenderer();
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(three.getScene(), three.camera);
  const { shaderPass, filmPass, dotScreenPass, bloomPass } = passFns();

  composer.addPass(renderPass);
  composer.addPass(shaderPass());

  const effectsManage = createEffects();
  const renderEffects = effectsManage.renderEffects;

  const renderedScene = new TexturePass(composer.renderTarget2.texture);

  const filmComposer = new EffectComposer(renderer);
  filmComposer.addPass(renderedScene);
  filmComposer.addPass(filmPass());

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.addPass(renderedScene);
  bloomComposer.addPass(bloomPass());
  bloomComposer.addPass(shaderPass());

  const dotScreenComposer = new EffectComposer(renderer);
  dotScreenComposer.addPass(renderedScene);
  dotScreenComposer.addPass(dotScreenPass());
  dotScreenComposer.addPass(shaderPass());

  renderer.autoClear = false;
  const { innerHeight, innerWidth } = window;
  const halfWidth = innerWidth / 2;
  const halfHeight = innerHeight / 2;
  function composerRender(times: number) {
    renderer.clear();
    renderEffects.forEach((f) => f());

    renderer.setViewport(0, 0, halfWidth, halfHeight);
    composer.render(times);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    filmComposer.render(times);

    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    bloomComposer.render(times);

    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);

    dotScreenComposer.render(times);
    window.requestAnimationFrame(composerRender);
  }

  function renderToScreen(isRender = true) {
    effectComposer.composer.renderToScreen = isRender;
  }

  return {
    ...effectsManage,
    composer,
    renderToScreen,
    composerRender,
  };
}

const three = useThree();
const effectComposer = initComposer();

onMounted(() => {
  addEarth();

  effectComposer.composerRender(0);
  three.mount();
  three.add(new AmbientLight(0xffffff, 1));
});
</script>
