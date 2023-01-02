<template>
  <div>
    <ProvideMessage>
      <InjectionMessageBase />
      <InjectionMessageShow />
    </ProvideMessage>
  </div>
</template>
<script lang="ts" setup>
import ProvideMessage from './ProvideMessage.vue';
import InjectionMessageBase from './InjectionMessageBase.vue';
import InjectionMessageShow from './InjectionMessageShow.vue';
</script>
