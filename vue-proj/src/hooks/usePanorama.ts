import { computed, onMounted, watch, watchEffect } from 'vue';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useCameraInteraction } from './useCameraInteraction';
import { useWindowListener } from './useListener';
import { useMouse } from './useMouse';
import { useMouseAxis } from './useRaycasterMouse';

function debounce(fn: () => void, delay = 50) {
  let timer: number;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), delay);
  };
}
function createPanorama(fn: () => void) {
  const sphereGeometry = new THREE.SphereGeometry(500, 60, 60);
  sphereGeometry.scale(1, 1, -1);
  const outLowMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('/src/assets/images/outside.jpg', fn),
  });

  const insideMaterial = new THREE.MeshBasicMaterial({
    map: new TextureLoader().load('/src/assets/images/inside_low.jpg'),
  });

  return new THREE.Mesh(sphereGeometry, outLowMaterial);
}

function loadSprite() {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load('/src/assets/images/point.png'),
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(40, 40, 40);
  sprite.position.set(100, 0, 0);
  return sprite;
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

  const raySprites: THREE.Sprite[] = [];

  const hLight = new THREE.HemisphereLight(0xffffff);
  hLight.position.set(0, 40, 0);

  const dLight = new THREE.DirectionalLight(0xffffff);
  dLight.position.set(0, 40, -10);

  scene.add(hLight);
  scene.add(dLight);
  scene.add(addSprite());

  scene.add(
    createPanorama(() => {
      render();
    })
  );

  function addSprite() {
    raySprites.push(loadSprite());
    return raySprites[raySprites.length - 1];
  }

  function getRaySprites() {
    return raySprites;
  }
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
  function requestAnimationRender() {
    requestAnimationFrame(render);
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

  function setCameraPosition(x: number, y: number, z: number) {
    camera.position.set(x, y, z);
    camera.updateProjectionMatrix();
    requestAnimationRender();
  }
  return {
    render: requestAnimationRender,
    loopRender,
    resize: debounce(resize),
    mount,
    lookAt,
    getRaySprites,
    camera,
    setCameraPosition,
  };
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

const useRaycaster = (panorama: ReturnType<typeof create3DContainer>) => {
  const mouse = useMouseAxis();
  const raycaster = new THREE.Raycaster();
  const onMousedown = () => {
    raycaster.setFromCamera(
      { x: mouse.x.value, y: mouse.y.value },
      panorama.camera
    );
    const intersects = raycaster.intersectObjects(panorama.getRaySprites());

    if (intersects.length > 0) {
      const { point } = intersects[0];
      panorama.setCameraPosition(point.x, point.y, point.z);
    }
  };
  useWindowListener(window, 'mousedown', onMousedown);
};

export const usePanorama = (selector = 'container') => {
  const position = useCameraInteraction();
  const panorama = create3DContainer(selector);
  useRaycaster(panorama);
  watch(position, ({ lat, lon }) => {
    panorama.lookAt(...getCameraFocus(lat, lon));
  });

  useWindowListener(window, 'resize', panorama.resize);
  onMounted(() => {
    panorama.mount();
  });
};
