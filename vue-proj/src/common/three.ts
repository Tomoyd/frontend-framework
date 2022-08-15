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

export function getSelectedCube<T extends Object3D>(
  event: MouseEvent,
  camera: Camera,
  objs: T[]
) {
  const vector = new Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(vector, camera);
  const intersects = raycaster.intersectObjects<T>(objs);
  return intersects;
}
