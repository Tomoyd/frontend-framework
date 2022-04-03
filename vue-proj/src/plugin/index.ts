import type { App } from 'vue';
export const translate = {
  install(app: App<Element>, options: any) {
    // 使用app globalProperties注册全局方法
    app.config.globalProperties.$translate = (word: string) => {
      return word.split('.').reduce((m, i) => {
        if (m) {
          return m[i];
        }
      }, options);
    };
  },
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $translate: (word: string) => string | undefined;
  }
}
