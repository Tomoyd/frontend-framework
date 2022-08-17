import { ref, watch, type Ref } from 'vue';

export const getObjResManageHooks = ({
  beforeEffect,
  afterEffect,
}: {
  beforeEffect?: () => void;
  afterEffect?: () => void;
}) => {
  return <T, Keys extends keyof T>(
    obj: T,
    handle: (current: T[Keys], obj?: T, val?: Keys) => void,
    init: Keys
  ) => {
    const currentType = ref<Keys>(init);

    watch(currentType, (newVal) => {
      beforeEffect?.();
      const key = newVal as Keys;
      handle(obj[key], obj, key);
      afterEffect?.();
    });

    return [currentType, obj] as [typeof currentType, T];
  };
};

export const useObjResManage = <T>(
  obj: T,
  handle: (current: T[keyof T], obj?: T, val?: keyof T) => void,
  init: keyof T
) => {
  const currentType = ref(init);

  watch(currentType, (newVal) => {
    const key = newVal as keyof T;
    handle(obj[key], obj, key);
  });

  return [currentType, obj] as [typeof currentType, T];
};
