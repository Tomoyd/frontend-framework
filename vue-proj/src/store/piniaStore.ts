import { createPinia, defineStore } from 'pinia';
import { ref } from 'vue';
export const pinia = createPinia();
export const useStore = defineStore('main', {
  state: () => {
    return {
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    };
  },

  getters: {
    doubleCounter(state) {
      return state.counter * 2;
    },
    counter4(): number {
      return this.doubleCounter * 4;
    },
    doubleX(state) {
      return (x: number) => state.counter * x;
    },
  },

  actions: {
    increment() {
      this.counter += 1;
    },
  },
});

// 推荐写法

export const useSetupStore = defineStore('setup', () => {
  const state = ref({ name: '1' });

  return { other: state };
});
