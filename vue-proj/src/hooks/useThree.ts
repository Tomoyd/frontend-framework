import { onMounted } from 'vue';
import * as THREE from 'three';

type Void = () => void;

const {
  AmbientLight,
  Fog,
  FogExp2,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} = THREE;
export function createMultiMaterialObject<T extends THREE.Material>(
  geometry: THREE.BufferGeometry,
  materials: T[]
) {
  const group = new THREE.Group();

  for (let i = 0, l = materials.length; i < l; i++) {
    const mesh = new Mesh(geometry, materials[i]);
    // mesh.castShadow = true;

    group.add(mesh);

    // group.castShadow = true;
  }
  // const geometry2 = new THREE.BoxGeometry(15, 30, 30);

  // //  THREE.WireframeGeometry

  const line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry));
  (line.material as THREE.LineBasicMaterial).color.set(0xff0000);
  group.add(line);

  return group;
}
export function customGeometry() {
  const geometry = new THREE.BufferGeometry();
  //  //   -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1,
  const vertices = new Float32Array([
    // -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1,
    -1, 1, 0, 1, 1, 0, 1, 1, 1,
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  return new Mesh(geometry, material);
}
type Item = [number, number, number];
export function createLineGeometry(vertices: Item[] = []) {
  const points = vertices.map((item) => new THREE.Vector3(...item));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // const vertices = new Float32Array([...vertice]);
  // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
}

function createLineCube() {
  const materials = [
    new THREE.MeshLambertMaterial({
      //   opacity: 0.4,
      color: 0x44ff44,
      //   transparent: true,
    }),
  ];

  const geometry = new THREE.BoxGeometry(10, 10, 10);

  return createMultiMaterialObject(geometry, materials);
}

export function useThree(id?: string) {
  const scene = new Scene();
  const perspectiveCamera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  perspectiveCamera.up.set(0, 1, 0);
  perspectiveCamera.updateMatrix();
  perspectiveCamera.position.set(0, 0, 60);
  perspectiveCamera.lookAt(new Vector3(0, 0, 1));

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.render(scene, perspectiveCamera);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x333333));
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  let renderHandle = 0;

  function createEffects() {
    const renderEffects: Void[] = [];
    function addEffects(fn: Void) {
      renderEffects.push(fn);
      return () => removeEffect(fn);
    }
    function removeEffect(fn: Void) {
      const index = renderEffects.findIndex(fn);
      renderEffects.splice(index, 1);
    }

    function getEffects() {
      return renderEffects;
    }

    return {
      getEffects,
      addEffects,
      removeEffect,
    };
  }

  const renderEffectStore = createEffects();

  function addSpotLight() {
    const spotLight = new SpotLight(0xffffff, 1.2, 100, 60);
    spotLight.position.set(10, 30, 28);
    spotLight.castShadow = true;
    spotLight.receiveShadow = true;
    // spotLight.shadow.bias = 0.6;
    spotLight.shadow.blurSamples = 10;
    // spotLight.shadow.radius = 10;

    // spotLight.shadow.camera.near = 1;
    // spotLight.shadow.camera.far = 100;
    // spotLight.shadow.camera.fov = 120;

    // spotLight.shadow.focus = 1;

    scene.add(new THREE.SpotLightHelper(spotLight));

    // scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
    scene.add(spotLight);
  }
  function addPlane() {
    const planeGeometry = new PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new MeshLambertMaterial({ color: 0xffffff });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    const ambientLight = new AmbientLight(0x606008);
    // ambientLight.name = 'ambient';
    scene.add(plane);
    scene.add(ambientLight);
  }

  function render() {
    renderer.render(scene, perspectiveCamera);
    renderEffectStore.getEffects().forEach((f) => f());
  }

  function loopRender() {
    render();
    renderHandle = window.requestAnimationFrame(loopRender);
  }

  function stopLoopRender() {
    window.cancelAnimationFrame(renderHandle);
  }

  function getOjectByName(name: string) {
    return scene.getObjectByName(name);
  }
  function traverse() {
    scene.traverse(function (obj) {
      console.log('obj', obj);
    });
  }

  function addCustomGeometry() {
    scene.add(customGeometry());
    scene.add(createLineCube());
  }

  function add(cube: THREE.Object3D) {
    scene.add(cube);
  }

  function mount() {
    document.getElementById(id || 'three')?.appendChild(renderer.domElement);
    window.requestAnimationFrame(render);
  }

  return {
    render,
    addSpotLight,
    addPlane,
    addCustomGeometry,
    add,
    loopRender,
    stopLoopRender,
    renderEffectStore,
    mount,
    camera: perspectiveCamera,
    dom: renderer.domElement,
  };
}
