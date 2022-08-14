import {
  createCubeByGeometry,
  getGeometries,
  getMaterials,
} from '@/common/three';
import { getObjResManageHooks } from '@/hooks/useObjResManage';

import { useThree } from '@/hooks/useThree';
import { AmbientLight, Mesh, MeshBasicMaterial } from 'three';
import { onMounted } from 'vue';

const getContainerHook = () => {
  function init() {
    const createCubeByBasic = createCubeByGeometry(
      new MeshBasicMaterial({ color: 0xffff00 })
    );
    cube = createCubeByBasic(geoOptions[geoType.value]);
    three.add(cube);
    three.add(new AmbientLight(0xff0000));
    three.mount();
  }

  function getToggle() {
    let isLoop = false;
    const removeEffects: (() => void)[] = [];
    function toggleRotate() {
      if (!cube) {
        return;
      }
      if (isLoop) {
        isLoop = false;
        removeEffects.forEach((f) => f());
        three.stopLoopRender();
        return;
      }
      const remove = three.renderEffectStore.addEffects(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.05;
      });
      isLoop = true;
      removeEffects.push(remove);
      three.loopRender();
    }

    return { toggleRotate };
  }
  let cube: Mesh;
  const three = useThree('three');
  const useResManage = getObjResManageHooks({
    afterEffect: () => window.requestAnimationFrame(three.render),
  });
  const [geoType, geoOptions] = useResManage(
    getGeometries(),
    (current) => {
      cube.geometry = current;
    },
    'dodecahedron'
  );

  const [materialType, materialOptions] = useResManage(
    getMaterials(),
    (current) => {
      cube.material = current;
    },
    'basic'
  );

  let fn = onMounted;
  const { toggleRotate } = getToggle();
  const containerHook = (needInit = true) => {
    fn(needInit ? init : () => false);
    fn = () => false;
    return {
      toggleRotate,
      materialOptions,
      materialType,
      geoOptions,
      geoType,
      three,
    };
  };

  return containerHook;
};

export const useThreeContainer = getContainerHook();
