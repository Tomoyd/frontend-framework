import {
  AmbientLight,
  BufferGeometry,
  DodecahedronGeometry,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
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
