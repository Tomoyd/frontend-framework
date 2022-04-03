import { ref } from 'vue';
import { useWindowListener } from './useListener';

export const useMouse = () => {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  useWindowListener(window, 'mousemove', update);

  return { x, y };
};
