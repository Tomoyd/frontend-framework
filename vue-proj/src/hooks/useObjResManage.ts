import { ref, watch } from 'vue';

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

export const useObjResManage = <T, Keys extends keyof T>(
  obj: T,
  handle: (current: T[Keys], obj?: T, val?: Keys) => void,
  init: Keys
) => {
  const currentType = ref<Keys>(init);

  watch(currentType, (newVal) => {
    const key = newVal as Keys;
    handle(obj[key], obj, key);
  });

  return {
    options: obj,
    currentType,
  };
};
