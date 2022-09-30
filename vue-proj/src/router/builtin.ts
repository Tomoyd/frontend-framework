import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/keep-alive',
    name: 'KeepAlive',
    component: () => import('../views/builtin/keepAlive/Index.vue'),
  },
  {
    path: '/attributes',
    name: 'attributes',
    component: () => import('../views/builtin/attributes/Index.vue'),
  },
];
export const builtinRoutes = routes.map((item) => {
  item.path = `/builtin${item.path}`;
  return item;
});
