import type { CubeMapKey } from '@/types';
import {
  AmbientLight,
  BufferGeometry,
  Camera,
  CubeCamera,
  CubeTexture,
  CubeTextureLoader,
  DodecahedronGeometry,
  DoubleSide,
  Group,
  HalfFloatType,
  IcosahedronGeometry,
  LinearMipmapLinearFilter,
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
  sRGBEncoding,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLCubeRenderTarget,
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
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PVRLoader } from 'three/examples/jsm/loaders/PVRLoader';
export * from 'three/examples/jsm/loaders/DDSLoader';
export * from 'three/examples/jsm/loaders/OBJLoader';

export * from 'three/examples/jsm/postprocessing/EffectComposer';
export * from 'three/examples/jsm/postprocessing/RenderPass';
export * from 'three/examples/jsm/postprocessing/ShaderPass';
export * from 'three/examples/jsm/postprocessing/FilmPass';
export * from 'three/examples/jsm/postprocessing/DotScreenPass';
export * from 'three/examples/jsm/postprocessing/BloomPass';
export * from 'three/examples/jsm/postprocessing/TexturePass';
export * from 'three/examples/jsm/shaders/CopyShader';
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

export function createCubeByGeometry<T extends Material>(material: T) {
  return function <G extends BufferGeometry>(geometry: G) {
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
  event: MouseEvent | TouchEvent,
  camera: Camera,
  objs: T[]
) {
  const { clientX, clientY } =
    event instanceof MouseEvent ? event : event.touches[0];
  const vector = getNormalVector3(clientX, clientY);

  raycaster.setFromCamera(vector, camera);
  const intersects = raycaster.intersectObjects<T>(objs);
  return intersects;
}

export const LoadMap = {
  texture: TextureLoader,
  dds: DDSLoader,
  pvr: PVRLoader,
};

const cache = new Map<string, (Texture | null)[]>();
export async function loadTexture<T extends string>(
  names: T[],
  baseUrl: string,
  loadType: keyof typeof LoadMap = 'texture'
) {
  const loader = new LoadMap[loadType]();

  const key = names.join('-');
  const cacheTextures = cache.get(key);
  if (cacheTextures) {
    return cacheTextures;
  }

  const textures = await Promise.all(
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
  cache.set(key, textures);
  return textures;
}
export function getTextureLoader<T extends string>(baseUrl: string) {
  const cacheTextureMaterial = new Map();

  async function loadTextureNormal(
    filenames: T[],
    loadType: keyof typeof LoadMap = 'texture',
    mapType: 'map' | 'bumpMap' | 'normalMap' | 'displacementMap' = 'map'
  ) {
    let material: MeshStandardMaterial = cacheTextureMaterial.get(
      filenames.join('-')
    );
    if (material) {
      return material;
    }
    const [texture1, texture2] = await loadTexture(
      filenames,
      baseUrl,
      loadType
    );

    const parameters: MeshStandardMaterialParameters = {
      // envMap: createCubeTexture('car'),
      map: texture1,
      color: 0xffffff,
      roughness: 0.01,
      metalness: 0,
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
    new MeshPhongMaterial({ color: 0xffffff, side: DoubleSide })
  )(new PlaneGeometry(100, 100));
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  plane.position.set(0, -5, 0);
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

export const loadObj = async (url: string) => {
  const objLoader = new OBJLoader();

  return new Promise<Group | null>((resolve) => {
    objLoader.load(
      url,
      (obj) => {
        resolve(obj);
      },
      undefined,
      () => resolve(null)
    );
  });
};

export const getCubeTextureLoader = () => {
  const cubeLoader = new CubeTextureLoader();
  const directions = [
    'right.png',
    'left.png',
    'top.png',
    'bottom.png',
    'front.png',
    'back.png',
  ];
  const cache = new Map<CubeMapKey, CubeTexture>();
  return function load(cubeType: CubeMapKey) {
    let cubeTexture = cache.get(cubeType);

    if (cubeTexture) {
      return cubeTexture;
    }

    cubeTexture = cubeLoader
      .setPath(`/three/textures/cubeMap/${cubeType}/`)
      .load(directions);
    cubeTexture.encoding = sRGBEncoding;
    cache.set(cubeType, cubeTexture);
    return cubeTexture;
  };
};

export const createCubeTexture = getCubeTextureLoader();

export const createCubeCamera = () => {
  const cubeRenderTarget = new WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = HalfFloatType;
  const cubeCamera = new CubeCamera(10, 100, cubeRenderTarget);
  const material = new MeshStandardMaterial({
    envMap: cubeRenderTarget.texture,
    roughness: 0.05,
    metalness: 1,
  });

  const cube = new Mesh(new IcosahedronGeometry(15, 8), material);

  return {
    cube,
    cubeCamera,
  };
};
