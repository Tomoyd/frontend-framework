import {
  AmbientLight,
  BufferGeometry,
  Camera,
  DodecahedronGeometry,
  DoubleSide,
  Loader,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Scene,
  SpotLight,
  SpotLightHelper,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  type MeshStandardMaterialParameters,
} from 'three';
export * from 'three/examples/jsm/controls/OrbitControls';
export * from 'three/examples/jsm/controls/FirstPersonControls';
export * from 'three/examples/jsm/controls/TrackballControls';
export * from 'three/examples/jsm/controls/PointerLockControls';
export * from 'three/examples/jsm/loaders/GLTFLoader';
export * from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { PVRLoader } from 'three/examples/jsm/loaders/PVRLoader';
export * from 'three/examples/jsm/loaders/DDSLoader';

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

export const LoadMap = {
  texture: TextureLoader,
  dds: DDSLoader,
  pvr: PVRLoader,
};
async function load<T extends string>(
  names: T[],
  baseUrl: string,
  loadType: keyof typeof LoadMap = 'texture'
) {
  const loader = new LoadMap[loadType]();

  return await Promise.all(
    names.map(
      (filename) =>
        new Promise<Texture | null>((resolve) => {
          loader.load(
            `${baseUrl}${filename}`,
            (texture) => {
              resolve(texture);
            },
            undefined,
            () => resolve(null)
          );
        })
    )
  );
}
export function getTextureLoader<T extends string>(baseUrl: string) {
  const cacheTextureMaterial = new Map();

  async function loadTextureNormal(
    filenames: T[],
    loadType: keyof typeof LoadMap = 'texture',
    mapType: 'map' | 'bumpMap' | 'normalMap' | 'displacementMap' = 'map'
  ) {
    let material: Material = cacheTextureMaterial.get(filenames.join('-'));
    if (material) {
      return material;
    }
    console.log('filenames', filenames);
    const [texture1, texture2] = await load(filenames, baseUrl, loadType);

    const parameters: MeshStandardMaterialParameters = {
      map: texture1,
      metalness: 0.02,
      roughness: 0.07,
    };
    if (mapType !== 'map') {
      parameters[mapType] = texture2;
    }

    material = new MeshStandardMaterial(parameters);

    cacheTextureMaterial.set(filenames.join('-'), material);
    return material;
  }

  return loadTextureNormal;
}

export const createGroundPlane = () => {
  const plane = createCubeByGeometry(
    new MeshPhongMaterial({ color: 0xffffff })
  )(new PlaneGeometry(100, 100));
  plane.receiveShadow = true;
  plane.position.setZ(-10);
  return plane;
};

export const createSpotLight = () => {
  const spotLight = new SpotLight(0xffffff);
  spotLight.position.set(-10, 30, 40);
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.fov = 15;
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.05;
  spotLight.name = 'spot light';
  return spotLight;
};
