<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <div class="outer">
    <button @click="open = true">Open Modal</button>
    <!-- disabled 可以选择是否禁用 -->
    <Teleport to="body" :disabled="false">
      <div v-if="open" class="modal">
        <p>hello from the modal</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </div>
</template>

<style>
.outer {
  position: relative;
  z-index: 0;
}
.modal {
  position: fixed;
  /* z-index  不使用Teleport 会被包含它的元素约束 */
  z-index: 999;
  background-color: #ff0;
  top: 20%;
  width: 200px;
  left: 50%;
  margin-left: -100px;
}
</style>
