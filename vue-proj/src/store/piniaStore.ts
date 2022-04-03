import { createPinia, defineStore } from 'pinia';

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

export const pinia = createPinia();
