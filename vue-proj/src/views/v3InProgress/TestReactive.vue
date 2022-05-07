<script setup lang="ts">
import { shallowReactive, ref, reactive, toRaw } from 'vue';
const refPerson = ref({ name: 'ref' });

// reactive 会深度遍历对ref进行解包
const person = reactive({ name: 'tomo', ref: refPerson });

//shallow 不会，那么访问时需要shallow.ref.value 方式访问
const shallow = shallowReactive({ ref: refPerson });
const personRaw = toRaw(person);
// markRaw  标记一个对象不可转为响应式的
</script>
<template>
  <div>
    <div>{{ personRaw }}</div>
    <div>{{ refPerson.name }}</div>
    <div>{{ person.ref.name }}</div>
    <input v-model="shallow.ref.value.name" />
  </div>
</template>
