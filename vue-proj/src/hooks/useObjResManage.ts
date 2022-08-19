import type { Void } from '@/types';
import { ref, watch } from 'vue';

export const getObjResManageHooks = ({
  beforeEffect,
  afterEffect,
}: {
  beforeEffect?: Void;
  afterEffect?: Void;
} = {}) => {
  return <T extends object>(
    obj: T,
    handle: (current: T[keyof T], val: keyof T, obj?: T) => void,
    init: keyof T
  ) => {
    const currentType = ref<keyof T>(init);

    watch(currentType, (newVal) => {
      beforeEffect?.();
      const key = newVal as keyof T;
      handle(obj[key], key, obj);
      afterEffect?.();
    });

    return [currentType, obj] as [typeof currentType, T];
  };
};

export const useObjResManage = getObjResManageHooks();
