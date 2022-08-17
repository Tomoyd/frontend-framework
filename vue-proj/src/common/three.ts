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
  Vector2,
  Vector3,
} from 'three';
export * from 'three/examples/jsm/controls/OrbitControls';
export * from 'three/examples/jsm/controls/FirstPersonControls';
export * from 'three/examples/jsm/controls/TrackballControls';
export * from 'three/examples/jsm/controls/PointerLockControls';
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
