import { onMounted } from 'vue';

export const usePanorama = (selector = 'container') => {
  onMounted(() => {
    console.log(document.getElementById(selector));
  });
};
