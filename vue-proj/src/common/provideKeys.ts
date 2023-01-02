import type { InjectionKey, Ref } from 'vue';

export const messageKey = Symbol('message') as InjectionKey<{
  message: Ref<string>;
}>;
