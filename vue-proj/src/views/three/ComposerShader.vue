<template>
  <div id="three"></div>
  <div id="stats"></div>
  <VFixed :left="80">
    <SelectBasic :options="composerOptions" v-model="currentComposer" />
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
  TexturePass,
} from '@/common/three';
import VFixed from '@/components/ui/VFixed.vue';
import {
  useObjResManage,
  type ResManageHandler,
} from '@/hooks/useObjResManage';

import { useThree } from '@/hooks/useThree';

import { AmbientLight, MeshPhongMaterial, SphereGeometry } from 'three';

import { onMounted } from 'vue';
import SelectBasic from '../../components/SelectBasic.vue';

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

async function createEarth() {
  const [map] = await loadTexture(['Earth.png'], '/three/textures/earth/');
  const earth = createCubeByGeometry(
    new MeshPhongMaterial({
      map: map,
      color: 0xffffff, // 定义发光的颜色, 光照上后显示的颜色，再与自发光结合
      emissive: 0x000000, // 自发光的颜色
    })
  )(new SphereGeometry(10));
  return earth;
}

async function simpleComposer() {
  const renderer = three.getRenderer();
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(three.getScene(), three.camera);
  const { shaderPass, filmPass, dotScreenPass, bloomPass } = passFns();

  composer.addPass(renderPass);
  composer.addPass(shaderPass());

  const effectsManage = three.renderEffectStore;
  const renderEffects = effectsManage.getEffects();

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

  const earth = await createEarth();
  three.add(earth);
  effectsManage.addEffects(() => {
    earth.rotation.y += 0.02;
  });

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
    composer.renderToScreen = isRender;
  }

  return {
    ...effectsManage,
    composer,
    renderToScreen,
    composerRender,
  };
}
const composerRes = {
  simpleComposer,
};

type ComposerRes = typeof composerRes;
const three = useThree();

const handler: ResManageHandler<ComposerRes> = (() => {
  const cache = new Map<keyof ComposerRes, (times: number) => void>();
  return async (init, key) => {
    let composerRender = cache.get(key);
    if (composerRender) {
      composerRender(0);
      return;
    }

    composerRender = (await init()).composerRender;
    composerRender(0);
    cache.set(key, composerRender);
  };
})();

const [currentComposer, composerOptions] = useObjResManage(
  composerRes,
  handler,
  'simpleComposer'
);

onMounted(() => {
  handler(composerRes.simpleComposer, 'simpleComposer');
  three.mount();
  three.add(new AmbientLight(0xffffff, 1));
});
</script>
