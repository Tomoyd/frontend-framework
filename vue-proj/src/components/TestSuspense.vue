<script setup lang="ts">
async function fakeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('1233');
    }, 5000);
  });
}

const data = await fakeData();
</script>

<template>
  <span>hello suspense {{ data }}</span>
</template>
