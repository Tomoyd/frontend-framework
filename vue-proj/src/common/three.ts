import {
  AmbientLight,
  BufferGeometry,
  Camera,
  DodecahedronGeometry,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
export * from 'three/examples/jsm/controls/OrbitControls';
export * from 'three/examples/jsm/controls/FirstPersonControls';
export * from 'three/examples/jsm/controls/TrackballControls';
export * from 'three/examples/jsm/controls/PointerLockControls';
export * from 'three/examples/jsm/loaders/GLTFLoader';
export * from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

export function createStats() {
  const stats = Stats();
  return stats;
}

export function getMaterials() {
  return {
    basic: new MeshBasicMaterial({ color: 0xffff00 }),
    basicWireFrame: new MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
    physical: new MeshPhysicalMaterial({ color: 0xff0000 }),
    standard: new MeshStandardMaterial(),
    normal: new MeshNormalMaterial({ colorWrite: true, side: DoubleSide }),
  };
}

export function getGeometries() {
  return {
    dodecahedron: new DodecahedronGeometry(20),
  };
}

export function createCubeByGeometry(material: Material) {
  return function (geometry: BufferGeometry) {
    return new Mesh(geometry, material);
  };
}
const raycaster = new Raycaster();

export const getNormalVector3 = (x = 0, y = 0) =>
  new Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.1
  );

export function getSelectedCube<T extends Object3D>(
  event: MouseEvent,
  camera: Camera,
  objs: T[]
) {
  const vector = getNormalVector3(event.clientX, event.clientY);

  raycaster.setFromCamera(vector, camera);
  const intersects = raycaster.intersectObjects<T>(objs);
  return intersects;
}

export function getTextureLoader<T extends string>(baseUrl: string) {
  const cacheTextureMaterial = new Map();
  function loadTexture(name: T) {
    let material: Material = cacheTextureMaterial.get(name);
    if (material) {
      return material;
    }
    const textureLoader = new TextureLoader();
    return new Promise<Material | false>((resolve) => {
      textureLoader.load(
        `${baseUrl}${name}`,
        (texture) => {
          material = new MeshStandardMaterial({ map: texture });
          cacheTextureMaterial.set(name, material);
          resolve(material);
        },
        undefined,
        () => resolve(false)
      );
    });
  }
  return loadTexture;
}
