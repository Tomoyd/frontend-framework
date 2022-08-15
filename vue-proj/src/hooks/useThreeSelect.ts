import { getSelectedCube } from '@/common/three';
import type { Camera, Intersection, Object3D } from 'three';
import { ref, watch, type Ref } from 'vue';
import { useWindowListener } from '@/hooks/useListener';
import { deleteItems } from '@/common';

export function useThreeSelect<T extends Object3D>(
  camera: Camera,
  effect?: (intersections: Intersection<T>[]) => void,
  objs?: T[]
) {
  let intersects: T[] = objs || [];
  const selectedObjs: Ref<Intersection<T>[]> = ref([]);

  if (effect) {
    watch(selectedObjs, (obj) => {
      effect(obj);
    });
  }

  function addIntersectObj(obj: T | T[]) {
    intersects.push(...(Array.isArray(obj) ? obj : [obj]));
  }

  function removeIntersectObj(obj: T | T[]) {
    intersects = deleteItems(intersects, Array.isArray(obj) ? obj : [obj]);
  }

  useWindowListener(window, 'mousedown', (event) => {
    selectedObjs.value = getSelectedCube(event, camera, intersects);
  });

  return {
    removeIntersectObj,
    addIntersectObj,
    selectedObjs,
  };
}
