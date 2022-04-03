import { onMounted, onUnmounted } from 'vue';

export const useWindowListener = <K extends keyof WindowEventMap>(
  target: Window,
  eventName: K,
  cb: (this: Window, ev: WindowEventMap[K]) => any,
) => {
  onMounted(() => target.addEventListener(eventName, cb));
  onUnmounted(() => target.removeEventListener(eventName, cb));
};
