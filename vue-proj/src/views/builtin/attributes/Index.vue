<template>
  <div>
    <MyButton text="hello world" @click="handleClick" />
    <MultiRoot :set="name" :name="name" />
  </div>
</template>
<!-- 单根节点 -->
<!-- MyButton 透传属性会透传到 MyButton 最外层的元素上，如果想屏蔽 声明inheritAttributes 为false -->
<!-- 需要传递到其他地方可以使用 v-bind $attrs -->
<!-- 符合条件会深度透传 -->
<!-- 多根节点，没有透传行为 不知道透传到哪里 当没有使用attrs时 会报警告 ，只要在模板中使用了 attrs就不会报错 -->
<!-- JS中可以使用useAtrrs 访问透传的属性-->

<!-- attrs 是非响应式的 -->

<script setup lang="ts">
import MyButton from './MyButton.vue';
import MultiRoot from './MultiRoot.vue';
import { ref } from 'vue';
const name = ref('hello');
function handleClick(e: MouseEvent) {
  name.value = 'hi';
}
</script>
