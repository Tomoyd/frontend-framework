import { onMounted, onUnmounted, watchEffect } from 'vue';
import * as THREE from 'three';

function create3DContainer(selector: string) {
  const scene = new THREE.Scene();
  const { innerHeight, innerWidth } = window;
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  document.getElementById(selector)?.appendChild(renderer.domElement);
  function resize() {
    const { innerHeight, innerWidth } = window;
    camera.aspect = innerWidth / innerHeight;
    renderer.setSize(innerHeight, innerWidth);
    camera.updateProjectionMatrix();
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
  function loopRender() {
    requestAnimationFrame(loopRender);
    render();
  }
  render();

  return { render, loopRender, resize };
}
export const usePanorama = (selector = 'container') => {
  watchEffect(
    (cleanup) => {
      const { resize } = create3DContainer(selector);
      window.addEventListener('resize', resize, false);
      cleanup(() => {
        window.removeEventListener('resize', resize, false);
      });
    },
    { flush: 'post' }
  );
};
