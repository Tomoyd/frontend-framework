<script lang="ts">
import { useStore } from '@/store/piniaStore';
import { mapActions, mapState } from 'pinia';
import { onMounted } from 'vue';
export default {
  computed: {
    ...mapState(useStore, ['counter']),
  },
  methods: {
    ...mapActions(useStore, ['increment']),
  },
};
</script>
<script setup lang="ts">
const store = useStore();

store.$subscribe((mutations, state) => {
  console.log('mutations', mutations);
  console.log('state', state);
});
onMounted(() => {
  store.$patch((state) => {
    state.isAdmin = false;
  });
  store.$patch({
    name: 'counterStore',
  });
});
store.$onAction(({ name, store, args, after, onError }) => {
  console.log('actions', name, store, args);
  after((resolveReturn) => {
    console.log('resolveReturn', resolveReturn);
  });
  onError((err) => {
    console.log('err', err);
  });
});
</script>

<template>
  <div>{{ store.name }}</div>
  <div>{{ store.isAdmin }}</div>

  <div>{{ counter }}</div>
  <button @click="increment">add</button>
  <div>
    {{
      ` 2x:${store.doubleCounter}
        7x:${store.doubleX(7)}
        4x:${store.counter4}
        `
    }}
  </div>
</template>
