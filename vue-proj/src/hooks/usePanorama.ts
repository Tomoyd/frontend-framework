import { computed, onMounted, watch, watchEffect } from 'vue';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useCameraInteraction } from './useCameraInteraction';
import { useWindowListener } from './useListener';

function debounce(fn: () => void, delay = 50) {
  let timer: number;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), delay);
  };
}
function createPanorama(fn: () => void) {
  const sphereGeometry = new THREE.SphereGeometry(1000, 60, 60);
  sphereGeometry.scale(1, 1, -1);
  const outLowMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('/src/assets/images/outside.jpg', fn),
  });

  const insideMaterial = new THREE.MeshBasicMaterial({
    map: new TextureLoader().load('/src/assets/images/inside_low.jpg'),
  });

  return new THREE.Mesh(sphereGeometry, outLowMaterial);
}
function create3DContainer(selector: string) {
  const scene = new THREE.Scene();
  const { innerHeight, innerWidth } = window;
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    1,
    1000
  );

  const hLight = new THREE.HemisphereLight(0xffff00);
  hLight.position.set(0, 40, 0);

  const dLight = new THREE.DirectionalLight(0xffff00);
  dLight.position.set(0, 40, -10);

  scene.add(hLight);
  scene.add(dLight);
  scene.add(
    createPanorama(() => {
      render();
    })
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);

  function lookAt(x = 0, y = 0, z = 0) {
    camera.lookAt(500 * x, 0, 500 * z);
    camera.updateProjectionMatrix();
    requestAnimationFrame(render);
  }
  function resize() {
    const { innerHeight, innerWidth } = window;
    camera.aspect = innerWidth / innerHeight;
    renderer.setSize(innerWidth, innerHeight);
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

  function mount() {
    document.getElementById(selector)?.appendChild(renderer.domElement);
    lookAt(...getCameraFocus(0, 0));
    render();
  }

  return { render, loopRender, resize: debounce(resize), mount, lookAt };
}
function getCameraFocus(lat = 0, lon = 0) {
  lat = Math.max(-85, Math.min(85, lat));
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

export const usePanorama = (selector = 'container') => {
  const position = useCameraInteraction();
  const panorama = create3DContainer(selector);

  watch(position, ({ lat, lon }) => {
    panorama.lookAt(...getCameraFocus(lat, lon));
  });

  useWindowListener(window, 'resize', panorama.resize);
  onMounted(() => {
    panorama.mount();
  });
};
