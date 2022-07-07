import { ref } from 'vue';
import { useWindowListener } from './useListener';

export const useMouseAxis = () => {
  const x = ref(0);
  const y = ref(0);
  useWindowListener(window, 'mousemove', (event) => {
    x.value = (event.pageX / window.innerWidth) * 2 - 1;
    y.value = -(event.pageY / window.innerHeight) * 2 + 1;
  });

  return { x, y };
};
